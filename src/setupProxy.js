const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  const options = {
    target: 'http://qrsms-v1.herokuapp.com', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    // pathRewrite: {
    //   '^/bts/': '/', // rewrite path
    // },
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'localhost:3000': 'http://localhost:8000',
    }
  };
  // create the proxy (without context)
  // var exampleProxy = proxy(options);
  // if ((process.env.proxy_url === 'http://qrsms-v1.herokuapp.com') || (process.env.proxy_url === 'https://qrsms-v1.herokuapp.com') ){
  //     app.use(proxy('/management', {target : 'http://qrsms-v1.herokuapp.com'}));
  // }
  // else{
  //     app.use(proxy('/management', {target : 'http://localhost:8000'}));
  // }
  app.use(proxy('/authentication/get_csrf', options));
  app.use(proxy('/iindex', options));
  app.use(proxy('/vsm', options));
  app.use(proxy('/classification', options));
  app.use(proxy('/clustering', options));
};
