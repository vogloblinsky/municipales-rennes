import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const ENV = process.env.ENV || 'dev';

const PLUGINS = [resolve(), commonjs(), json()];

const createConfig = type => {
    let MAIN_CONFIG = {
        input: 'src/index.js',
        output: {
            file: 'dist/scripts/index.js',
            format: 'es'
        },
        plugins: [resolve(), commonjs(), json()]
    };
    if (type === 'es5') {
        MAIN_CONFIG.output.file = 'dist/scripts/index_es5.js';
        MAIN_CONFIG.output.format = 'iife';
        MAIN_CONFIG.plugins.push(babel());
    }
    if (ENV !== 'dev') {
        MAIN_CONFIG.plugins.push(terser());
    }
    return MAIN_CONFIG;
};

const CONFIG = [createConfig('es6'), createConfig('es5')];

export default CONFIG;
