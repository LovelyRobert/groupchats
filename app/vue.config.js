const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: process.env.VUE_APP_API_ENDPOINT + "/",
        changeOrigin: true,
        ws: false,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "openCHAT - Group chats for everyone!";
      return args;
    });
  },
};
