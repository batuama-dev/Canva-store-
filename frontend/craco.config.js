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