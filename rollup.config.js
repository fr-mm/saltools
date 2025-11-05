import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/index.js',
	output: [
		{
			file: 'dist/index.js',
			format: 'esm',
			sourcemap: true,
		},
		{
			file: 'dist/index.cjs',
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		},
	],
	plugins: [resolve(), commonjs()],
	external: [
		'axios',
		'libphonenumber-js',
		'validator',
	],
};
