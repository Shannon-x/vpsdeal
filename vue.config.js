// 在文件顶部声明 Codespaces 隧道 hostname
const csName = process.env.CODESPACE_NAME;
const tunnelHost = csName ? `${csName}-8080.app.github.dev` : undefined;

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.runtime.esm-bundler.js'
      }
    },
    plugins: [
      new (require('webpack').DefinePlugin)({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ],
    output: {
      filename: '[name].js',
      chunkFilename: 'js/[name].js'
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    allowedHosts: ['all'],
    historyApiFallback: true,
    compress: true,

    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    hot: false,           // 禁用 HMR，避免 SockJS 连接问题
    liveReload: true,     // 使用全页面刷新替代 HMR

    clientLogLevel: 'info',
  },
  publicPath: '/'
}