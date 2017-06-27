var path = require('path');

module.exports = function(app) {

  app.use(app.loopback.token({ model: app.models.accessToken, currentUserLiteral: 'me' }));

  var router = app.loopback.Router();
  console.log(path.join(__dirname, '../../client/'));
  router.get('/status', app.loopback.status());

  app.use(router);
};
