const CopyWebpackPlugin = require('copy-webpack-plugin')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

const path = require('path')

const baseConfig = {
  entry: path.resolve(__dirname, 'src/js/index.ts'),
  devtool: 'inline-source-map',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [path.resolve(__dirname, 'node_modules')],
    descriptionFiles: [path.resolve(__dirname, 'package.json')],
    symlinks: false
  },
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        loader: 'ts-loader',
        exclude: path.resolve(__dirname, 'node_modules')
      }
    ]
  },
  plugins: [
    new WasmPackPlugin({
      crateDirectory: __dirname,
      outName: 'index',
      forceMode: 'production',
      extraArgs: '--target bundler --mode normal'
    })
  ],
  experiments: {
    asyncWebAssembly: true
  }
}

const prodConfig = baseConfig

const devConfig = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'package.json'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    })
  ]
}

module.exports = (env, argv) => {
  return (argv.mode === 'development') ? devConfig : prodConfig
}