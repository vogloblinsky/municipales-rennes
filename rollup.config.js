import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const ENV = process.env.ENV || 'dev';

const PLUGINS = [resolve(), json()];

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
