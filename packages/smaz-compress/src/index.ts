import { Trie, create } from '@remusao/trie';

const EMPTY_UINT8_ARRAY = new Uint8Array(0);

export class SmazCompress {
  private readonly buffer: Uint8Array;
  private readonly trie: Trie;
  private readonly verbatim: Uint8Array;

  constructor(codebook: readonly string[], maxSize = 30000) {
    this.trie = create(codebook);
    this.buffer = new Uint8Array(maxSize);
    this.verbatim = new Uint8Array(255);
  }

  public getCompressedSize(str: string | Uint8Array): number {
    if (str.length === 0) {
      return 0;
    }

    let data: Uint8Array;
    if (typeof str === 'string') {
      data = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        data[i] = str.charCodeAt(i);
      }
    } else {
      data = str;
    }

    let bufferIndex = 0;
    let verbatimIndex = 0;
    let inputIndex = 0;

    while (inputIndex < data.length) {
      let indexAfterMatch = -1;
      let code = -1;
      let root: Trie | undefined = this.trie;

      for (let j = inputIndex; j < str.length; j += 1) {
        root = root.chars.get(data[j]);
        if (root === undefined) {
          break;
        }

        if (root.code !== undefined) {
          code = root.code;
          indexAfterMatch = j + 1;
        }
      }
      if (code === -1) {
        verbatimIndex++;
        inputIndex++;

        if (verbatimIndex === 255) {
          bufferIndex += 2 + verbatimIndex;
          verbatimIndex = 0;
        }
      } else {
        if (verbatimIndex !== 0) {
          bufferIndex += 2 + (verbatimIndex === 1 ? 0 : verbatimIndex);
          verbatimIndex = 0;
        }

        bufferIndex++;
        inputIndex = indexAfterMatch;
      }
    }

    if (verbatimIndex !== 0) {
      bufferIndex += 2 + (verbatimIndex === 1 ? 0 : verbatimIndex);
    }

    return bufferIndex;
  }

  public compress(str: string | Uint8Array): Uint8Array {
    if (str.length === 0) {
      return EMPTY_UINT8_ARRAY;
    }

    let data: Uint8Array;
    if (typeof str === 'string') {
      data = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        data[i] = str.charCodeAt(i);
      }
    } else {
      data = str;
    }

    let bufferIndex = 0;
    let verbatimIndex = 0;
    let inputIndex = 0;

    while (inputIndex < data.length) {
      let indexAfterMatch = -1;
      let code = -1;
      let root: Trie | undefined = this.trie;

      for (let j = inputIndex; j < data.length; j += 1) {
        root = root.chars.get(data[j]);
        if (root === undefined) {
          break;
        }

        if (root.code !== undefined) {
          code = root.code;
          indexAfterMatch = j + 1;
        }
      }

      if (code === -1) {
        this.verbatim[verbatimIndex++] = data[inputIndex++];
        if (verbatimIndex === 255) {
          bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
          verbatimIndex = 0;
        }
      } else {
        if (verbatimIndex !== 0) {
          bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
          verbatimIndex = 0;
        }
        this.buffer[bufferIndex++] = code;
        inputIndex = indexAfterMatch;
      }
    }

    if (verbatimIndex !== 0) {
      bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
    }

    return this.buffer.slice(0, bufferIndex);
  }

  private flushVerbatim(verbatimIndex: number, bufferIndex: number): number {
    if (verbatimIndex === 1) {
      this.buffer[bufferIndex++] = 254;
      this.buffer[bufferIndex++] = this.verbatim[0];
    } else {
      this.buffer[bufferIndex++] = 255;
      this.buffer[bufferIndex++] = verbatimIndex;
      for (let k = 0; k < verbatimIndex; k += 1) {
        this.buffer[bufferIndex++] = this.verbatim[k];
      }
    }
    return bufferIndex;
  }
}
