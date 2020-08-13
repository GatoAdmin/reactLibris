const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
      createProxyMiddleware('/about', {
          target: 'http://localhost:9000/',
          changeOrigin: true
      })
  )
};