const path = require('path');

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Set the output directory to 'output'
      webpackConfig.output.path = path.resolve(__dirname, 'output');

      webpackConfig.ignoreWarnings = [
        {
          module: /^(?!.*node_modules.*)/, // Ignore warnings from modules outside node_modules
          message: /Critical dependency: the request of a dependency is an expression/,
        },
        {
          module: /node_modules/, // Ignore warnings from all modules inside node_modules
          message: /Critical dependency: the request of a dependency is an expression/,
        },
      ];
      // For older Webpack versions or if the above doesn't work, you might need:
      // webpackConfig.stats = {
      //   warningsFilter: [/Critical dependency: the request of a dependency is an expression/],
      // };
      return webpackConfig;
    },
  },
};