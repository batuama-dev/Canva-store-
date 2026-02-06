module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Find the PostCSS loader and configure it
      const oneOf = webpackConfig.module.rules.find((rule) => rule.oneOf);
      if (oneOf) {
        const cssRule = oneOf.oneOf.find(
          (rule) => rule.test && rule.test.toString().includes('.css') && rule.use && rule.use.some(u => u.loader && u.loader.includes('postcss-loader'))
        );

        if (cssRule) {
          const postcssLoader = cssRule.use.find(u => u.loader && u.loader.includes('postcss-loader'));
          if (postcssLoader) {
            postcssLoader.options.postcssOptions = {
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            };
          }
        }
      }

      // Restore ignoreWarnings
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

      return webpackConfig;
    },
  },
};