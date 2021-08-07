const { preserveShebangs } = require('rollup-plugin-preserve-shebangs');

export default {
    input: {
        index: 'src/index.js',
    },
    output: {
        dir: 'dist',
        format: 'cjs',
        esModule: false,
        preserveModules: true,
        strict: false,
    },
    plugins: [preserveShebangs()],
};
