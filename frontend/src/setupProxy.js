const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  //本地服务器的地址
  const developUrl = "http://localhost:8080";
  //线上的接口地址
  const productionUrl = "http://localhost:8080";
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
