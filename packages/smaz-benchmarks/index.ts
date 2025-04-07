import * as Benchmark from 'benchmark';
import chalk from 'chalk';

import * as smaz from '@remusao/smaz';
import * as zlib from 'zlib';

import * as shorter from '@deps/shorter';
import * as personalcomputerSmaz from '@deps/smaz';
import * as tinyString from '@deps/tiny-string';

// Does not work so far:
// > for (let index = this.dictionary.length - 1; index >= 0; index--) {
// >                  ^
// > TypeError: Cannot read property 'length' of undefined
// import * as compatto from './deps/compatto/index';

function benchCompress(
  name: string,
  strings: string[],
  compress: (str: string) => number,
): void {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  });

  let totalCompressed = 0;
  let totalSize = 0;
  for (const str of strings) {
    totalSize += str.length;
    totalCompressed += compress(str);
  }
  const ratio = 100.0 * (totalCompressed / totalSize);

  const suite = new Benchmark.Suite();
  suite
    .add(name, () => {
      for (const str of strings) {
        compress(str);
      }
    })
    .on('cycle', (event: { target: { hz: number } }) => {
      console.log(
        `  + ${name} ${formatter.format(
          Math.floor(event.target.hz * totalSize),
        )} bytes/second (${Math.floor(ratio)}% of initial size)`,
      );
    })
    .run({ async: false });
}

function benchDecompress(
  name: string,
  strings: string[],
  compress: (str: string) => Uint8Array | string,
  decompress: (str: Uint8Array | string) => Uint8Array | string,
): void {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  });

  // Validate benched function
  const buffers: (Uint8Array | string)[] = [];
  let totalSize = 0;
  for (const str of strings) {
    const compressed = compress(str);
    totalSize += compressed.length;
    buffers.push(compressed);
    if (decompress(compressed) !== str) {
      throw new Error(`Failed on: '${str}'`);
    }
  }

  const suite = new Benchmark.Suite();
  suite
    .add(name, () => {
      for (const buffer of buffers) {
        decompress(buffer);
      }
    })
    .on('cycle', (event: { target: { hz: number } }) => {
      console.log(
        `  + ${name} ${formatter.format(
          Math.floor(event.target.hz * totalSize),
        )} bytes/second`,
      );
    })
    .run({ async: false });
}

(() => {
  const strings = [
    'This is a small string',
    'foobar',
    'the end',
    'not-a-g00d-Exampl333',
    'Smaz is a simple compression library',
    'Nothing is more difficult, and therefore more precious, than to be able to decide',
    'this is an example of what works very well with smaz',
    '1000 numbers 2000 will 10 20 30 compress very little',
    'Nel mezzo del cammin di nostra vita, mi ritrovai in una selva oscura',
    'Mi illumino di immenso',
    "L'autore di questa libreria vive in Sicilia",
    'http://google.com',
    'http://programming.reddit.com',
    'http://github.com/antirez/smaz/tree/master',
  ];

  console.log('===== compress');

  benchCompress(
    `${chalk.bold('@remusao/smaz')}#${chalk.underline('compress')}`,
    strings,
    (str) => smaz.compress(str).length,
  );

  benchCompress(
    `${chalk.bold('shorter')}#${chalk.underline('compress')}`,
    strings,
    (str) => shorter.compress(str).length,
  );

  benchCompress(
    `${chalk.bold('zlib')}#${chalk.underline('gzipSync')}`,
    strings,
    (str) => zlib.gzipSync(str).length,
  );

  benchCompress(
    `${chalk.bold('smaz')}#${chalk.underline('compress')}`,
    strings,
    (str) => personalcomputerSmaz.compress(str).length,
  );

  // benchCompress(
  //   `${chalk.bold('compatto')}#${chalk.underline('compress')}`,
  //   strings,
  //   (str) => compatto.compatto.compress(str).length,
  // );

  benchCompress(
    `${chalk.bold('tiny-string')}#${chalk.underline('tinyStringCompress')}`,
    strings,
    (str) => tinyString.tinyStringCompress(str).length,
  );

  console.log('===== decompress');

  benchDecompress(
    `${chalk.bold('@remusao/smaz')}#${chalk.underline('decompress')}`,
    strings,
    (str) => smaz.compress(str),
    (buffer) => smaz.decompress(buffer as Uint8Array),
  );

  benchDecompress(
    `${chalk.bold('shorter')}#${chalk.underline('decompress')}`,
    strings,
    (str) => shorter.compress(str),
    (buffer) => shorter.decompress(buffer as string),
  );

  benchDecompress(
    `${chalk.bold('zlib')}#${chalk.underline('gunzipSync')}`,
    strings,
    (str) => zlib.gzipSync(str),
    (buffer) => zlib.gunzipSync(buffer).toString('ascii'),
  );

  benchDecompress(
    `${chalk.bold('smaz')}#${chalk.underline('decompress')}`,
    strings,
    (str) => personalcomputerSmaz.compress(str),
    (buffer) => personalcomputerSmaz.decompress(buffer as Uint8Array),
  );

  // benchDecompress(
  //   `${chalk.bold('compatto')}#${chalk.underline('decompress')}`,
  //   strings,
  //   (str) => compatto.compatto.compress(str),
  //   (buffer) => compatto.compatto.decompress(buffer),
  // );

  benchDecompress(
    `${chalk.bold('tiny-string')}#${chalk.underline('tinyStringDecompress')}`,
    strings,
    (str) => tinyString.tinyStringCompress(str),
    (buffer) => tinyString.tinyStringDecompress(buffer as string),
  );
})();
