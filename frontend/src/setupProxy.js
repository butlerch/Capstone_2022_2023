const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {

    const developUrl = "https://mineral-catwalk-368610.de.r.appspot.com";

  const productionUrl = "https://mineral-catwalk-368610.de.r.appspot.com";
  app.use(
    "/api",
    createProxyMiddleware({
      target: developUrl,
      changeOrigin: true,
      pathRewrite: {
        "/api": "",
      },
    })
  );
};
