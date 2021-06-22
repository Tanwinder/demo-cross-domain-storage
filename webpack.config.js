const path = require("path");
// const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("./node_modules/mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("./node_modules/clean-webpack-plugin");
const HtmlWebpackPlugin = require("./node_modules/html-webpack-plugin");
// const  ModuleFederationPlugin  =  require("webpack/lib/container/ModuleFederationPlugin");

const packageJson = require('./package.json');
const deps = packageJson.dependencies;
const {NODE_ENV} = process.env;
let mode = NODE_ENV || 'development';   // development or production
let target = "web";  // web or node
const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: "./public/index.html",
  }),
  // new  ModuleFederationPlugin({
  //   name: "showroom",
  //   library: {type: 'var', name : "showroom" },
  //   filename: 'remoteEntry.js',
  //   exposes: {
  //     // "./SearchByItemWrapper": "./src/components/SearchByItemWrapper.js" ,
  //     // "./showroom": "./src/index.js",
  //     "./showroom": "./src/components/app.js"
  //   },
  //   shared: {
  //     react: {
  //       singleton: true,
  //       requiredVersion: deps.react,
  //       eager: true
  //     },
  //     'react-dom': {
  //       singleton: true,
  //       requiredVersion: deps['react-dom'],
  //       eager: true
  //     }
  //   }
  // })
];

if (process.env.NODE_ENV === "production") {
  mode = "production";
  // Temporary workaround for 'browserslist' bug that is being patched in the near future
//   target = "browserslist";
}

// if (process.env.SERVE) {
//   // We only want React Hot Reloading in serve mode
//   plugins.push(new ReactRefreshWebpackPlugin());
// }

module.exports = {
  // mode defaults to 'production' if not set
  mode: mode,

  // This is unnecessary in Webpack 5, because it's the default.
  // However, react-refresh-webpack-plugin can't find the entry without it.
  entry: "./src/index.js",

  output: {
    publicPath: 'auto'
    // publicPath: mode === "production" ? 'https://mfe-showroom.netlify.app/' : 'http://localhost:4001/'
    // output path is required for `clean-webpack-plugin`
    // path: path.resolve(__dirname, "dist"),
    // this places all images processed in an image folder
    // assetModuleFilename: "images/[hash][ext][query]",
  },

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // This is required for asset imports in CSS, such as url()
            options: { publicPath: "" },
          },
          "css-loader",
          "postcss-loader",
          // according to the docs, sass-loader should be at the bottom, which
          // loads it first to avoid prefixes in your sourcemaps and other issues.
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        /**
         * The `type` setting replaces the need for "url-loader"
         * and "file-loader" in Webpack 5.
         *
         * setting `type` to "asset" will automatically pick between
         * outputing images to a file, or inlining them in the bundle as base64
         * with a default max inline size of 8kb
         */
        type: "asset",

        /**
         * If you want to inline larger images, you can set
         * a custom `maxSize` for inline like so:
         */
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 30 * 1024,
        //   },
        // },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          // without additional settings, this will reference .babelrc
          loader: "babel-loader",
          options: {
            /**
             * From the docs: When set, the given directory will be used
             * to cache the results of the loader. Future webpack builds
             * will attempt to read from the cache to avoid needing to run
             * the potentially expensive Babel recompilation process on each run.
             */
            cacheDirectory: true,
          },
        },
      },
    ],
  },

  plugins: plugins,

  target: target,

  devtool: "source-map",  // devtool: false || source-map || 

  resolve: {
    extensions: [".js", ".jsx"],
  },

  // required if using webpack-dev-server
  devServer: {
    contentBase: "./",
    port: 4003,
    historyApiFallback: true, 
    hot: true,   // hot reloading
  },
};
