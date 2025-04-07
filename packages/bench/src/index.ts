import Benchmark from 'benchmark';

export default function bench<Arg>(
  fn: (arg: Arg) => unknown,
  inputs: Iterable<Arg>,
): number {
  const inputsArray: Arg[] = [...inputs];
  const numberOfInputs = inputsArray.length;

  let result = -1;

  new Benchmark.Suite()
    .add(fn.name, () => {
      for (const input of inputs) {
        fn(input);
      }
    })
    .on('cycle', (event: { target: { hz: number } }) => {
      result = Math.floor(event.target.hz * numberOfInputs);
    })
    .run({ async: false });

  return result;
}
