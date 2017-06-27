var oeApp = require('oe-cloud');
var path = require('path');
var loopback = oeApp.loopback;
var app = loopback();
var options = oeApp.options;

// apphome is used by evfoundation to know application server directory
// as of now it used for picking providers.json
app.locals.apphome = __dirname;

options.bootDirs.push(path.join(__dirname, 'boot'));
options.clientAppRootDir = __dirname;
oeApp.boot(app, options,function(){
    var context = loopback.getCurrentContext();
    if (context) {
        context.set('callContext', {});
    }
    app.start();
});

var ensureLoggedIn = function ensureLoggedIn(req, res, next) {
  if (req.accessToken) {
    next();
  } else {
    res.redirect('/login');
    return;
  }
};

// Routes needed for login and logout and serving files
app.get('/', ensureLoggedIn, function(req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/') });
});

app.get("/index.html", ensureLoggedIn, function(req, res) {
  res.redirect('/');
});

app.get("/loggedin", ensureLoggedIn, function(req, res) {
  res.redirect('/');
});

app.get('/login', function(req, res) {
  res.sendFile('login.html', { root: path.join(__dirname, '../client/auth/') });
});

app.get('/signup', function(req, res) {
  res.sendFile('signup.html', { root: path.join(__dirname, '../client/auth/') });
});

app.get('/resetPassword', function(req, res) {
  res.sendFile('resetPassword.html', { root: path.join(__dirname, '../client/auth/') });
});

app.get('/forgotPassword', function(req, res) {
  res.sendFile('forgotPassword.html', { root: path.join(__dirname, '../client/auth/') });
});

app.get('/logout', function(req, res) {
  var resp = {};
  resp.error = {
    message: 'Invalid username/password'
  };
  res.status(401).send(resp);
});

// Protecting Api Explorer from unauthorized access
// Comment the below line if you want to allow access without login.
app.get('/explorer', ensureLoggedIn);

app.on("started", function(app) {
    console.log('app started');
});


