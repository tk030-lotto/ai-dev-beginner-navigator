/**
 * クライアントサイド ハッシュルーター
 * GitHub Pages等の静的ホスティング環境で動作する軽量ルーター
 */

export interface ParsedRoute {
  path: string;
  pluginId?: string;
  query?: string;
}

export type RouteChangeHandler = (route: ParsedRoute) => void;

export class HashRouter {
  private handlers: RouteChangeHandler[] = [];

  constructor() {
    window.addEventListener('hashchange', () => {
      this.notify();
    });
  }

  public parseCurrentRoute(): ParsedRoute {
    const hash = window.location.hash.slice(1); // 先頭の # を除去
    if (!hash || hash === '/' || hash === '') {
      return { path: '/' };
    }

    // #/plugin/:id パターン
    const pluginMatch = hash.match(/^\/plugin\/([^/?]+)/);
    if (pluginMatch) {
      return {
        path: '/plugin',
        pluginId: decodeURIComponent(pluginMatch[1]),
      };
    }

    return { path: hash };
  }

  public navigate(hashPath: string): void {
    const formatted = hashPath.startsWith('#') ? hashPath : `#${hashPath}`;
    if (window.location.hash !== formatted) {
      window.location.hash = formatted;
    } else {
      // 同じハッシュでも明示的に通知
      this.notify();
    }
  }

  public onRouteChange(handler: RouteChangeHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  private notify(): void {
    const route = this.parseCurrentRoute();
    for (const handler of this.handlers) {
      handler(route);
    }
  }

  public init(): void {
    this.notify();
  }
}
