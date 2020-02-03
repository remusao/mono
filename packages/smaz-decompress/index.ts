export class SmazDecompress {
  constructor(private readonly codebook: readonly string[]) {
  }

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
