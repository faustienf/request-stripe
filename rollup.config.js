import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import styles from 'rollup-plugin-styles';
import esbuild from 'rollup-plugin-esbuild';

const plugins = ({ target } = {}) => {
  return [
    styles({ modules: true }),
    typescript({
      tsconfigOverride: { declaration: true },
    }),
    esbuild({
      minify: true,
      target,
    }),
  ];
};

const entry = (input) => {
  const { dir, name } = path.parse(input);
  const filename = `${dir}/${name}`;
  return [
    {
      input: `src/${input}`,
      output: {
        file: `dist/${filename}.mjs`,
        format: 'es',
      },
      plugins: plugins({ target: 'esnext' }),
    },
    {
      input: `src/${input}`,
      output: {
        file: `dist/${filename}.js`,
        format: 'cjs',
      },
      plugins: plugins({ target: 'es2015' }),
    },
  ];
};

export default [...entry('index.ts'), ...entry('request-stripe.ts')];
