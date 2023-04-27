const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  //本地服务器的地址
  const developUrl = "https://mineral-catwalk-368610.de.r.appspot.com/";
  //线上的接口地址
  const productionUrl = "http://124.70.19.165:11089";
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
  app.use(
    "/getIp",
    createProxyMiddleware({
      target: "https://myip.ipip.net",
      changeOrigin: true,
      pathRewrite: {
        "/getIp": "",
      },
    })
  );
};
