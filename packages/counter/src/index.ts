export class Counter<K> {
  private readonly map: Map<K, number> = new Map();

  constructor(init?: [K, number][]) {
    if (init !== undefined) {
      for (const [key, count] of init) {
        this.incr(key, count);
      }
    }
  }

  get size(): number {
    return this.map.size;
  }

  public clear(): void {
    this.map.clear();
  }

  public delete(key: K): boolean {
    return this.map.delete(key);
  }

  public has(key: K): boolean {
    return this.map.has(key);
  }

  public get(key: K): number {
    const count = this.map.get(key);
    if (count === undefined) {
      return 0;
    }
    return count;
  }

  public incr(key: K, n: number = 1): this {
    if (n < 0) {
      throw new Error(`Counter#incr only accepts positive values: ${n}`);
    }

    this.map.set(key, this.get(key) + n);
    return this;
  }

  public decr(key: K, n: number = 1): this {
    if (n < 0) {
      throw new Error(`Counter#decr only accepts positive values: ${n}`);
    }

    const count = this.get(key);

    if (count <= n) {
      this.map.delete(key);
    } else {
      this.map.set(key, count - n);
    }

    return this;
  }

  public entries(): IterableIterator<readonly [K, number]> {
    return this.map.entries();
  }

  public keys(): IterableIterator<K> {
    return this.map.keys();
  }
}
