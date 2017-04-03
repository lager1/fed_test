var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');


const saml = require('@socialtables/saml-protocol');
const fs = require('fs');
const saml_model = require('./model_test');

var index = require('./routes/index');
var page1 = require('./routes/page1');
var page2 = require('./routes/page2');
var page3 = require('./routes/page3');

var app = express();

// TODO?
app.use(session({ secret: 'appsecret', saveUninitialized: true, resave: false, cookie: { secure: true, maxAge: new Date(Date.now() + 3600000) } }));
//app.use(passport.initialize());
//app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/page1', page1);
app.use('/page2', page2);
app.use('/page3', page3);

// --------------------------------------------------------------------------------------
// saml

var pvk = fs.readFileSync('cert/etlog.cesnet.cz.key.pem', 'utf-8');
var cert = fs.readFileSync('cert/etlog.cesnet.cz.crt.pem', 'utf-8');
var idpcert = fs.readFileSync('cert/idp-cert.pem', 'utf-8');


const spConfig = {
  entityID: "https://etlog-dev.cesnet.cz",
  credentials: [
    {
      certificate: cert,
      privateKey: pvk
    }
  ],
  endpoints: {
    assert: "https://etlog-dev.cesnet.cz/login/callback"
  }
};

// --------------------------------------------------------------------------------------

const idpConfig = {
  entityID: "https://whoami-dev.cesnet.cz",
  credentials: [
    {
      certificate: idpcert
    }
  ],
  endpoints: {
    login: "https://whoami-dev.cesnet.cz/idp/profile/SAML2/Redirect/SSO"
  }
};

//const model = < your model instance >;  # we'll come back to this later

const sp = new saml.ServiceProvider(spConfig, saml_model);
const requestDescriptor = sp.produceAuthnRequest(idpConfig);


// --------------------------------------------------------------------------------------


app.get('/login', function(req, res, next) {
  res.send("/login");
});

app.post('/login/callback', function(req, res, next) {
  res.send("/login/callback");
});

// --------------------------------------------------------------------------------------
//app.get('/metadata', function(req, res, next) {
//  res.type('application/xml');
//  //res.status(200).send(strategy.generateServiceProviderMetadata(cert));
//});


// --------------------------------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

