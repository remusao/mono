import { browser } from 'webextension-polyfill-ts';

async function getActiveTabId(): Promise<number> {
  const tabs = await browser.tabs.query({ active: true });
  if (tabs.length === 1) {
    const { id } = tabs[0];
    if (id !== undefined) {
      return id;
    }
  }
  return 0;
}

function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

type Color = string | [number, number, number, number];

export class Badge {
  /**
   * Keep track of number of network requests altered for each tab.
   */
  private readonly counter: Map<number, number> = new Map();

  // Colors
  private readonly badgeTextColor: Color;
  private readonly badgeBackgroundColor: Color;

  // Icons
  private readonly iconDisabled: string;
  private readonly iconEnabled: string | string[];

  // Throttling
  private readonly minimumUpdateLatency: number;

  private activeTabId: number = 0;
  private lock: boolean = false;
  private enabled: boolean = true;

  constructor({
    badgeTextColor = 'white',
    badgeBackgroundColor = 'blue',
    iconDisabled,
    iconEnabled,
    minimumUpdateLatency = 500, // In milliseconds
  }: {
    badgeTextColor: Color;
    badgeBackgroundColor?: Color;
    iconDisabled: string;
    iconEnabled: string | string[];
    minimumUpdateLatency?: number;
  }) {
    // Colors
    this.badgeTextColor = badgeTextColor;
    this.badgeBackgroundColor = badgeBackgroundColor;

    // Icons
    this.iconEnabled = iconEnabled;
    this.iconDisabled = iconDisabled;

    // Throttling
    this.minimumUpdateLatency = minimumUpdateLatency;

    // Whenever the active tab changes, then we update the count of blocked request
    browser.tabs.onActivated.addListener(({ tabId }) => {
      this.activeTabId = tabId;
      this.updateBadgeForTab(tabId);
    });

    // Reset counter if tab is reloaded
    browser.webNavigation.onBeforeNavigate.addListener(({ tabId, frameId }) => {
      if (frameId === 0) {
        this.reset(tabId);
      }
    });

    getActiveTabId().then((tabId) => {
      this.activeTabId = tabId;
    });

    // Initialize badge text and background colors
    browser.browserAction.setBadgeTextColor?.({ color: this.badgeTextColor });
    browser.browserAction.setBadgeBackgroundColor({
      color: this.badgeBackgroundColor,
    });
  }

  public incr(tabId: number): void {
    this.counter.set(tabId, (this.counter.get(tabId) || 0) + 1);
    this.startUpdatingBadge();
  }

  public reset(tabId: number): void {
    this.counter.delete(tabId);
    if (this.enabled === true) {
      browser.browserAction.setBadgeText({ text: '0' });
    }
  }

  public disable(): void {
    this.enabled = false;
    this.counter.clear();
    browser.browserAction.setBadgeText({ text: '' });
    browser.browserAction.setIcon({ path: this.iconDisabled });
  }

  public enable(): void {
    this.enabled = true;
    browser.browserAction.enable();
    browser.browserAction.setIcon({ path: this.getFirstEnabledIconFrame() });
    browser.browserAction.setBadgeText({ text: '0' });
  }

  private getFirstEnabledIconFrame(): string {
    if (Array.isArray(this.iconEnabled)) {
      return this.iconEnabled[0];
    }

    return this.iconEnabled;
  }

  private async updateBadgeForTab(tabId: number): Promise<void> {
    if (this.enabled === true) {
      await browser.browserAction.setBadgeText({
        text: '' + (this.counter.get(tabId) || 0),
      });
    }
  }

  private async startUpdatingBadge(): Promise<void> {
    if (this.enabled === false) {
      return; // Badge is disabled
    }

    if (this.lock === true) {
      return; // Already updating
    }

    this.lock = true;
    try {
      if (Array.isArray(this.iconEnabled)) {
        for (let i = 1; i <= this.iconEnabled.length; i += 1) {
          await Promise.all([
            this.updateBadgeForTab(this.activeTabId),
            browser.browserAction.setIcon({
              path: this.iconEnabled[i % this.iconEnabled.length],
            }),
          ]);
          await sleep(this.minimumUpdateLatency);
        }
      } else {
        await this.updateBadgeForTab(this.activeTabId);
        await sleep(this.minimumUpdateLatency);
      }
    } catch (ex) {
      console.log('Error while updating badge', ex);
    } finally {
      this.lock = false;
    }
  }
}
