declare module '@deps/tiny-string' {
  export function generateDictionary(
    data: string,
    sLen?: number,
    MBYTES?: number,
  ): string[];
  export function trueByteSize(data: string): number;
  export function tinyStringCompress(data: string, dict?: string[]): string;
  export function tinyStringDecompress(data: string, dict?: string[]): string;
}
