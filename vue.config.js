module.exports = {
  lintOnSave: true,

  pluginOptions: {
    quasar: {},
    electronBuilder: {
      builderOptions: {
        appId: "com.yeppymp.app",
        productName: "CPU Simulator",
        name: "cpu-simulator-project",
        files: ["**/*", "./build/icon.*"],
        icon: "./build/icon.png"
      }
    }
  },

  transpileDependencies: [/[\\\/]node_modules[\\\/]quasar[\\\/]/]
};
