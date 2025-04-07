export class SmazDecompress {
  constructor(private readonly codebook: readonly string[]) {}

  public decompress(arr: Uint8Array): string {
    if (arr.byteLength === 0) {
      return '';
    }

    let output = '';
    let i = 0;

    while (i < arr.byteLength) {
      if (arr[i] === 254) {
        output += String.fromCharCode(arr[i + 1]);
        i += 2;
      } else if (arr[i] === 255) {
        const stop = i + arr[i + 1] + 2;
        for (i += 2; i < stop; i += 1) {
          output += String.fromCharCode(arr[i]);
        }
      } else {
        output += this.codebook[arr[i]];
        i += 1;
      }
    }
    return output;
  }
}

export class SmazDecompressRaw {
  public static fromStringCodebook(codebook: readonly string[]) {
    return new this(
      codebook.map((str) => {
        const arr = new Uint8Array(str.length);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = str.charCodeAt(i);
        }
        return arr;
      }),
    );
  }

  private EMPTY_UINT8_ARRAY = new Uint8Array(0);

  constructor(private readonly codebook: readonly Uint8Array[]) {}

  public decompress(arr: Uint8Array): Uint8Array {
    if (arr.byteLength === 0) {
      return this.EMPTY_UINT8_ARRAY;
    }

    const chunks: Uint8Array[] = [];
    let i = 0;

    while (i < arr.byteLength) {
      if (arr[i] === 254) {
        chunks.push(arr.subarray(i + 1, i + 2));
        i += 2;
      } else if (arr[i] === 255) {
        const stop = i + arr[i + 1] + 2;
        chunks.push(arr.subarray(i + 2, stop));
        i = stop;
      } else {
        chunks.push(this.codebook[arr[i]]);
        i += 1;
      }
    }

    const output = new Uint8Array(
      chunks.reduce((state, chunk) => state + chunk.byteLength, 0),
    );
    for (let j = 0, offset = 0; j < chunks.length; j++) {
      output.set(chunks[j], offset);
      offset += chunks[j].byteLength;
    }

    return output;
  }
}
