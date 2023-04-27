const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

function isProduction() {
  for (const arg of process.argv) {
    if (arg === '--mode=production') {
      console.log('Using production settings');
      return true;
    }
  }
  return false;
}

const isProd = isProduction();

const commonConfig = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: {
          // Use babel-loader. Note: no-type checking at build time so we
          // still need tsc.
          // Alternatively, use ts-loader
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-typescript',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic'
                }
              ]
            ]
          },
        },
      },
    ],
  },
  devtool: isProd ? undefined : 'eval-cheap-module-source-map',
  mode: isProd ? 'production' : 'development', // For production, pass the argument to webpack --mode=production
};

const frontendConfig = {
  entry: './app/src/index',
  output: {
    path: path.resolve(__dirname, 'dist', 'public'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/app/',
  },
  module: {
    ...commonConfig.module,
    rules: [
      ...commonConfig.module.rules,
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(woff(2)?|ttf|eot|png|jpe?g|gif|svg|png)$/, use: 'file-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/public/index.html',
      favicon: 'app/public/favicon.ico',
    }),
  ],
};

const backendConfig = {
  entry: './server/main',
  output: {
    path: path.resolve(__dirname, 'dist', 'server'),
    filename: 'backend_bundle.js',
  },
  externals: [nodeExternals()],
  target: 'node',
  node: {
    __dirname: true,
  },
};

module.exports = [
  { ...commonConfig, ...frontendConfig },
  { ...commonConfig, ...backendConfig },
];
