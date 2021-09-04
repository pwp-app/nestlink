import path from 'path';
import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const PREFIX_WHITELIST = ['@tigojs/lambda-', '@tigojs/api-'];

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }));
const devrc = JSON.parse(fs.readFileSync('./.tigodev.json', { encoding: 'utf-8' }));

let external = [];

// only module in require allow list are external package
const configuredExternal = devrc?.rollup?.external;
if (configuredExternal && Array.isArray(configuredExternal)) {
  external = external.concat(configuredExternal);
}

if (pkg.dependencies) {
  Object.keys(pkg.dependencies).forEach((dependency) => {
    if (PREFIX_WHITELIST.includes(dependency)) {
      external.push(dependency);
    }
  });
}

const extensions = ['.js'];

const options = {
  input: './src/func/main.js',
  output: {
    file: devrc?.rollup?.output || './dist/bundled.js',
    format: 'cjs',
    strict: false,
  },
  watch: {
    include: './src/func/**/*.js',
  },
  external,
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelrc: false,
      exclude: ['node_modules/**'],
      babelHelpers: 'bundled',
      extensions,
      configFile: path.resolve(__dirname, 'babel.config.func.js'),
    }),
  ],
};

export default options;
