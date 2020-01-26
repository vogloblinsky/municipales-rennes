import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const ENV = process.env.ENV || 'dev';

const PLUGINS = [resolve(), commonjs(), json()];

if (ENV !== 'dev') {
    PLUGINS.push(terser());
}

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/scripts/index.js',
        format: 'iife'
    },
    plugins: PLUGINS
};
