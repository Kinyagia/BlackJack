const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  }, 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 
         {
           loader: 'babel-loader'
         }
      },
      {
        test: /\.css$/,
        use: [ 
         {
         loader: 'style-loader',
         },
         {
         loader:   'css-loader'
         }
       ]  
      }      
    ]
  },
  
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

};
