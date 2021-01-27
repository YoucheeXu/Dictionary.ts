module.exports = {
    extends: ['google', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'prettier',
        'html', // 检查html当中script标签
    ],
    settings: {
        'html/html-extensions': ['.html'], // 除js文件外，会去检查文件中script标签配置
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    env: {
        es5: true,
    },
    rules: {
        'prettier/prettier': 1,
        'no-console': 'off',
        '@typescript-eslint/indent': ['error', 4],
        'linebreak-style': ['error', 'windows'],
    },
};
