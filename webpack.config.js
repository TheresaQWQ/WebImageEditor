const path = require('path')

module.exports = (env, argv) => ({
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, argv.mode === 'production' ? 'dist' : 'demo')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  }
})
