import { SmazCompress } from '@remusao/smaz-compress';
import { Counter } from '@remusao/counter';

export interface Options {
  minNgram: number;
  maxNgram: number;
  maxRoundsWithNoImprovements: number;
  finetuneNgrams: number[];
  debug: (...args: any[]) => void;
}

class FakeCounter {
  constructor(private readonly array: readonly string[]) {
  }

  public *entries(): IterableIterator<readonly [string, number]> {
    for (const str of this.array) {
      yield [str, 1];
    }
  }
}

export class Builder {
  private readonly added: Counter<string> = new Counter();
  private readonly removed: Counter<string> = new Counter();

  constructor(private readonly strings: readonly string[]) {
  }

  public *entries(): IterableIterator<readonly [string, number]> {
    for (const str of this.strings) {
      if (this.removed.has(str) === false) {
        yield [str, 1];
      }
    }
    yield* this.added.entries();
  }

  public removeWithSubstring(substring: string): {
    added: Counter<string>;
    removed: Counter<string>;
  } {
    const toAdd: Counter<string> = new Counter();
    const toDel: Counter<string> = new Counter();

    for (const [str, count] of this.entries()) {
      let indexOfSubstring = str.indexOf(substring);
      if (indexOfSubstring !== -1) {
        toDel.incr(str, count);

        let index = 0;
        do {
          if (index !== indexOfSubstring) {
            toAdd.incr(str.slice(index, indexOfSubstring), count);
          }

          index = indexOfSubstring + substring.length;
          indexOfSubstring = str.indexOf(substring, index);
        } while (indexOfSubstring !== -1);

        if (index < str.length) {
          toAdd.incr(str.slice(index), count);
        }
      }
    }

    for (const [str, count] of toAdd.entries()) {
      this.added.incr(str, count);
    }

    for (const [str, count] of toDel.entries()) {
      this.removed.incr(str, count);
      this.added.delete(str);
    }

    return {
      added: toAdd,
      removed: toDel,
    };
  }
}

function addCounts(
  strings: IterableIterator<readonly [string, number]>,
  counter: Counter<string>,
  minNgram: number,
  maxNgram: number,
): void {
  for (const [str, count] of strings) {
    if (str.length !== 0) {
      const len = str.length;
      for (let j = 0; j < len; j += 1) {
        const remainingChars = len - j;
        for (let k = minNgram; k <= maxNgram && k <= remainingChars; k += 1) {
          counter.incr(str.slice(j, j + k), count);
        }
      }
    }
  }
}

function delCounts(
  strings: IterableIterator<readonly [string, number]>,
  counter: Counter<string>,
  minNgram: number,
  maxNgram: number,
): void {
  for (const [str, count] of strings) {
    if (str.length !== 0) {
      const len = str.length;
      for (let j = 0; j < len; j += 1) {
        const remainingChars = len - j;
        for (let k = minNgram; k <= maxNgram && k <= remainingChars; k += 1) {
          counter.decr(str.slice(j, j + k), count);
        }
      }
    }
  }
}

function getNextBestSubstring(counter: Counter<string>, minNgram: number = 1): string {
  let bestScore = 0;
  let bestSubstring = '';
  for (const [substring, count] of counter.entries()) {
    if (substring.length >= minNgram && count > 2) {
      // Who does not like a bit of magic?
      const score = count * substring.length ** 2.3;
      if (score > bestScore) {
        bestSubstring = substring;
        bestScore = score;
      }
    }
  }

  return bestSubstring;
}

function getCompressionRatio(
  codebook: readonly string[],
  strings: readonly string[],
): number {
  const smaz = new SmazCompress(codebook);
  let totalCompressed = 0;
  let totalUncompressed = 0;

  for (const str of strings) {
    totalCompressed += smaz.getCompressedSize(str);
    totalUncompressed += str.length;
  }

  return 100.0 * (totalCompressed / totalUncompressed);
}

function longestString(strings: readonly string[]): number {
  let longest = 0;
  for (const str of strings) {
    if (longest < str.length) {
      longest = str.length;
    }
  }
  return longest;
}

export function generate(
  originalStrings: readonly string[],
  {
    minNgram = 1,
    maxNgram = longestString(originalStrings),
    maxRoundsWithNoImprovements = 5,
    finetuneNgrams = [1],
    debug = console.log,
  }: Partial<Options> = {},
): string[] {
  minNgram = Math.min(minNgram, ...finetuneNgrams);
  maxNgram = Math.max(maxNgram, ...finetuneNgrams);
  const maxFinetuneNgram = Math.max(...finetuneNgrams) + 1;

  const codebook: string[] = [];
  const counter: Counter<string> = new Counter();
  const strings = new Builder(originalStrings);

  debug(`Counting [${minNgram},${maxNgram}]-grams`);
  addCounts(new FakeCounter(originalStrings).entries(), counter, minNgram, maxNgram);
  debug('Counter size', counter.size);

  debug('Creating codebook.');
  for (let i = 0; i < 254; i += 1) {
    const substring = getNextBestSubstring(counter, maxFinetuneNgram);
    if (substring.length === 0) {
      debug('No more strings', i);
      break;
    }

    codebook.push(substring);
    debug(`+ ${substring}`);

    const { added, removed } = strings.removeWithSubstring(substring);
    addCounts(added.entries(), counter, minNgram, maxNgram);
    delCounts(removed.entries(), counter, minNgram, maxNgram);
  }

  debug(`ratio = ${getCompressionRatio(codebook, originalStrings)}%`);

  if (finetuneNgrams.length !== 0) {
    finetuneNgrams.sort().reverse();
    for (const n of finetuneNgrams) {
      const nCounter: Counter<string> = new Counter();
      addCounts(new FakeCounter(originalStrings).entries(), nCounter, n, n);
      const candidates = [...nCounter.entries()].sort((v1, v2) => v2[1] - v1[1]);
      let roundsWithNoImprovements = 0;
      debug(`[finetune] ${n}-grams`, candidates);

      for (const [candidate, count] of candidates) {
        let bestRatio = getCompressionRatio(codebook, originalStrings);

        // If codebook is not full yet, just add the letter at the end
        if (codebook.length < 254) {
          codebook.push(candidate);
          debug(
            `Codebook not full, adding : ${candidate} = ${getCompressionRatio(
              codebook,
              originalStrings,
            )}`,
          );
          continue;
        }

        if (roundsWithNoImprovements >= maxRoundsWithNoImprovements) {
          debug(`Stopping optimization process after ${maxRoundsWithNoImprovements} rounds`);
          break;
        }

        // Codebook is full, try to find a spot
        let bestR = 100;
        let insertAt = -1;
        debug('?', candidate, count);
        for (let j = 0; j < codebook.length; j += 1) {
          const prev = codebook[j];
          codebook[j] = candidate;
          const ratio = getCompressionRatio(codebook, originalStrings);
          codebook[j] = prev;
          if (ratio < bestR) {
            bestR = ratio;
            insertAt = j;
          }
        }

        if (bestR < bestRatio) {
          debug(
            `replacing ${codebook[insertAt]} with ${candidate} = ${bestR}% (-${(
              bestRatio - bestR
            ).toFixed(3)}%)`,
          );

          codebook[insertAt] = candidate;
          bestRatio = bestR;
          roundsWithNoImprovements = 0;
        } else {
          roundsWithNoImprovements += 1;
        }
      }
    }
  }

  return codebook;
}
