// Implement pattern matching as described in the following document:
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns

// List of all supported schemes:
const SUPPORTED_SCHEMES = new Set([
  'http',
  'https',
  'ws',
  'wss',
  'ftp',
  'ftps',
  'data',
  'file',
]);

const WILDCARD_SCHEMES = new Set(['http', 'https', 'ws', 'wss']);

// Shallow validate a host by checking only allowed characters appear
const VALID_HOST = /^[.\w_-]+$/;

/**
 * Transform an arbitrary string into a RegExp compatible one:
 *  - escape special characters which can be encountered in RegExps (e.g.: '{' or '.')
 *  - replace '*' with '.*' to match anything
 *
 * The result from this function is a string which can be compiled to a RegExp
 * safely. For example: `new RegExp(compileToRegex('foo.bar'))`
 *
 *   > new RegExp(compileToRegex('foo*.[bar]'))
 *   /foo.*\.\[bar\]/
 *
 * '.', '[' and ']' have been escaped and '*' was replaced by '.*' (wildcard).
 */
function compileToRegex(str: string): string {
  return str.replace(/([|.$+?{}()[\]\\])/g, '\\$1').replace(/\*/g, '.*');
}

/**
 * Compile the <scheme> part from a match pattern. The matcher is a set of
 * allowed schemes which will be used to check if a given URL's scheme is
 * accepted.
 */
function createSchemeMatcher(scheme: string): Set<string> {
  if (scheme === '*') {
    // '*' in <scheme> only matches a subset of all valid protocols (see Mozilla
    // developer doc at the top for more details).
    return WILDCARD_SCHEMES;
  }

  if (SUPPORTED_SCHEMES.has(scheme)) {
    // Only this specific `scheme` will be accepted
    return new Set([scheme]);
  }

  throw new Error(`<scheme> is not valid: ${scheme}`);
}

/**
 * Compile the <host> part from a match pattern. The matcher is a RegExp object
 * which will be used to check the hostname attribute of a URL. This function
 * can also return `null`, which means that any hostname is accepted. In case of
 * failure, an exception is raised.
 */
function createHostMatcher(scheme: string, host: string): RegExp | null {
  // '*' constraint means we accept anything
  if (host === '*') {
    return null;
  }

  if (host.includes(':')) {
    throw new Error('<host> must not include a port number');
  }

  if (host.length === 0) {
    // Only 'file:///' can appear without a <host> constraint
    if (scheme === 'file') {
      return /^$/;
    }

    throw new Error('<host> is optional only if the scheme is "file"');
  }

  // Validate <host> containing a wildcard
  const lastWildcardInHost = host.lastIndexOf('*');
  if (lastWildcardInHost !== -1) {
    if (lastWildcardInHost !== 0) {
      throw new Error('<host> wildcard may only appear at the start');
    }

    if (host[1] !== '.') {
      throw new Error(
        '<host> only "*" and "*." followed by hostname parts are valid',
      );
    }

    // At this point we know that `host` is of the form *.<host>
    const hostAfterWildcard = host.slice(2);
    if (VALID_HOST.test(hostAfterWildcard) === false) {
      throw new Error('<host> contains invalid characters');
    }

    // Hostname *may* start with labels and *must* be followed by `hostAfterWildcard`
    return new RegExp(`^(?:.*[.])?${compileToRegex(hostAfterWildcard)}$`);
  }

  // If no wildcard in <host> it should only be a valid hostname
  if (VALID_HOST.test(host) === false) {
    throw new Error('<host> contains invalid characters');
  }

  return new RegExp(`^${compileToRegex(host)}$`);
}

/**
 * Compile the <path> part from a match pattern. The matcher is a RegExp object
 * which will be used against the pathname + search of a URL object.
 */
function createPathMatcher(path: string): RegExp | null {
  return path === '*' ? null : new RegExp(`^${compileToRegex(path)}$`);
}

export class Pattern {
  private readonly scheme: Set<string>;
  private readonly host: RegExp | null;
  private readonly path: RegExp | null;

  /**
   * Compile a match pattern as specified in https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
   *
   * The return value is an object with three attributes, each matching against
   * one part of the the URL:
   *
   * - `scheme` is a Set of accepted protocols from URL
   * - `host` is a RegExp to test `hostname` from URL (or `null` if no constraint)
   * - `path` is a RegExp to test `pathname` + `search` from URL (or `null`)
   */
  constructor(pattern: string) {
    // Special <all_urls> value means that any URL with supported schemes is matched
    if (pattern === '<all_urls>') {
      this.scheme = SUPPORTED_SCHEMES;
      this.host = null;
      this.path = null;
      return;
    }

    if (pattern === '*://*/*') {
      this.scheme = WILDCARD_SCHEMES;
      this.host = null;
      this.path = null;
      return;
    }

    // From this point we parse `pattern` and make sure it is valid. The structure
    // must be: <scheme>://<host><path>. Each part is also validated. In case an
    // error is encountered, an exception with explanation is raised.

    // ======================================================================= //
    // Extract and validate <scheme> (must be followed by '://')
    const indexOfProtocolSeparator = pattern.indexOf('://');
    if (indexOfProtocolSeparator === -1) {
      throw new Error('<scheme> missing, "://" not found');
    }

    const scheme = pattern.slice(0, indexOfProtocolSeparator);
    this.scheme = createSchemeMatcher(scheme);

    // ======================================================================= //
    // Extract and validate <host> (must be followed by '/')
    const indexOfSlash = pattern.indexOf('/', indexOfProtocolSeparator + 3);
    if (indexOfSlash === -1) {
      throw new Error('<path> missing, "/" not found');
    }

    const host = pattern.slice(indexOfProtocolSeparator + 3, indexOfSlash);
    this.host = createHostMatcher(scheme, host);

    // ======================================================================= //
    // Extract and validate <path>
    const path = pattern.slice(indexOfSlash + 1);
    this.path = createPathMatcher(path);
  }

  public match(url: string): boolean {
    const endOfProtocol = url.indexOf(':');
    if (endOfProtocol === -1 || endOfProtocol > 5) {
      return false;
    }

    const protocol = url.slice(0, endOfProtocol);

    if (this.scheme.has(protocol) === false) {
      return false;
    }

    const isFileProtocol = protocol === 'file';
    let startOfHostname = endOfProtocol + 1;
    while (url[startOfHostname] === '/') {
      startOfHostname += 1;
    }

    let endOfHostname = url.indexOf('/', startOfHostname);
    if (endOfHostname === -1) {
      endOfHostname = url.length;
    }

    if (this.host !== null) {
      if (
        this.host.test(
          isFileProtocol ? '' : url.slice(startOfHostname, endOfHostname),
        ) === false
      ) {
        return false;
      }
    }

    if (this.path !== null) {
      const startOfPath = isFileProtocol ? startOfHostname : endOfHostname + 1;
      let indexOfHash = url.indexOf('#', startOfPath);
      if (indexOfHash === -1) {
        indexOfHash = url.length;
      }

      if (this.path.test(url.slice(startOfPath, indexOfHash)) === false) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Check if `url` matches against `pattern` (which *must* be a valid match
 * pattern). See `Pattern#constructor(...)` for more information about patterns.
 */
export default function match(pattern: string, url: string): boolean {
  return new Pattern(pattern).match(url);
}
