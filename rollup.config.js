import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { fileURLToPath } from 'url';
import { dirname, resolve as resolvePath } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  plugins: [
    alias({
      entries: [
        {
          find: /^src\/(.*)$/,
          replacement: resolvePath(__dirname, 'src/$1'),
        },
      ],
    }),
    resolve({
      extensions: ['.js', '.mjs', '.json'],
    }),
    commonjs(),
  ],
  external: ['axios', 'libphonenumber-js', 'validator'],
};
