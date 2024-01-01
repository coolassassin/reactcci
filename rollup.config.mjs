import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import hashbang from 'rollup-plugin-hashbang';
import { terser } from 'rollup-plugin-terser';
import cjs from '@rollup/plugin-commonjs';

const extensions = ['.ts', '.js'];

export default {
    input: 'index.ts',
    output: {
        file: './build/cli.js',
        format: 'cjs',
        inlineDynamicImports: true
    },
    plugins: [
        resolve({ extensions }),
        babel({ extensions: ['.ts', '.js'], exclude: './node_modules/**' }),
        cjs(),
        // We call default, because hashbang plugin has broken export
        hashbang.default(),
        terser()
    ],
    external: ['path', 'fs', 'child_process', 'kleur', 'prompts', 'commander'],
};
