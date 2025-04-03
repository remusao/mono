module.exports = {
  timeout: 10000,
  reporter: 'spec',
  require: ['ts-node/register'],
  retries: 2,
  color: false,
  extension: ['ts'],
  recursive: true,
  'node-option': [
    'experimental-specifier-resolution=node',
    'loader=ts-node/esm',
  ]
};
