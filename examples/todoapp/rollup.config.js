import typescriptPlugin from 'rollup-plugin-typescript';
import typescript from 'typescript';

export default {
  entry: './src/main.ts',
  plugins: [
      typescriptPlugin({typescript: typescript})
  ],
    format: 'es',
    useStrict: true,
};