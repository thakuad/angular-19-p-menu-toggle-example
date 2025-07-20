module.exports = function(config) {
    config.set({
      basePath: "",
      frameworks: ["jasmine"],
      files: ["src/**/*.js"],
      browsers: ["ChromeHeadless"],
      customLaunchers: {
        Chrome: {
          base: "Chrome",
          flags: ["--no-sandbox"],
        },
      },
      env: {
        CHROME_BIN:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      },
      singleRun: true,
    });
};