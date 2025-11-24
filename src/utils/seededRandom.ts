export class SeededRandom {
  private seed: number;
  constructor(seed: string | number | undefined) {
    if (typeof seed === 'number') {
      this.seed = seed >>> 0;
    } else if (typeof seed === 'string') {
      // xorshift hash of string
      let h = 2166136261 >>> 0;
      for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      }
      this.seed = h >>> 0;
    } else {
      // default fixed seed for determinism
      this.seed = 0x9e3779b9;
    }
  }
  // xorshift32
  next(): number {
    let x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0;
    // convert to [0,1)
    return (this.seed >>> 0) / 0x100000000;
  }
  int(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive);
  }
  pick<T>(arr: T[]): T {
    if (arr.length === 0) {
      throw new Error('SeededRandom.pick called with empty array');
    }
    return arr[this.int(arr.length)];
  }
  shuffleInPlace<T>(arr: T[]): T[] {
    if (arr.length <= 1) return arr;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      const tmp: T = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }
}
