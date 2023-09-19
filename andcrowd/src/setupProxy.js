const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/oauth2.0', { // 사용할 엔드포인트
      target: 'https://nid.naver.com', // 요청할 서버 주소
      changeOrigin: true, // 호스트가 헤더 변경 가능 옵션
    })
  );
};