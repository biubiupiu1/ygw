module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'airbnb-base'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'consistent-return': 'off',
        indent: ['error', 4],
        'no-param-reassign': 'off',
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: './node_modules/@vue/cli-service/webpack.config.js',
            },
        },
    },
};
