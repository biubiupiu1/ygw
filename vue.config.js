/* eslint-disable no-param-reassign */
const IS_PROD = process.env.NODE_ENV === 'production';
const CompressionPlugin = require('compression-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const CDN = 'http://dev.biubiupiu.cn/ygw';

module.exports = {
    publicPath: IS_PROD ? CDN : '/',
    configureWebpack: (config) => {
        if (IS_PROD) {
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
                'console.log',
            ];
        }
    },
    chainWebpack: (config) => {
        config.plugin('define').tap((args) => {
            args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL);
            return args;
        });

        if (IS_PROD) {
            config.plugin('compression').use(CompressionPlugin, [
                {
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: /\.js$|\.css$|\.html$/,
                    threshold: 10240,
                    minRatio: 0.8,
                },
            ]);
            // config.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin);
        }
    },
};
