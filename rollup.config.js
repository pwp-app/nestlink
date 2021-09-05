import path from 'path';
import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { string } from '@backrunner/rollup-plugin-string';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';

const PREFIX_WHITELIST = ['@tigojs/lambda-', '@tigojs/api-'];

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }));
const devrc = JSON.parse(fs.readFileSync('./.tigodev.json', { encoding: 'utf-8' }));

let external = [];

// only module in require allow list are external package
const configuredExternal = devrc?.rollup?.external;
if (configuredExternal && Array.isArray(configuredExternal)) {
  external = external.concat(configuredExternal);
}

const dependencies = Object.keys(pkg.dependencies || {});
const devDependencies = Object.keys(pkg.devDependencies || {});

const allDependencies = [].concat(dependencies).concat(devDependencies);

if (allDependencies.length) {
  allDependencies.forEach((dependency) => {
    for (const prefix of PREFIX_WHITELIST) {
      if (dependency.includes(prefix)) {
        external.push(dependency);
        return;
      }
    }
  });
}

const extensions = ['.js'];

const options = {
  input: './src/func/main.js',
  output: {
    file: devrc?.rollup?.output || './dist/bundled.js',
    format: 'cjs',
    exports: 'auto',
    strict: false,
  },
  watch: {
    include: './src/func/**/*.js',
  },
  external,
  plugins: [
    nodeResolve(),
    commonjs(),
    string({
      include: ['./dist/**/*.js', './dist/**/*.css', './dist/**/*.html'],
    }),
    image(),
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
