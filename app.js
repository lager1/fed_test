var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');

const passport = require('passport');
const saml_strategy = require('passport-saml').Strategy;
const fs = require('fs');

var index = require('./routes/index');
var page1 = require('./routes/page1');
var page2 = require('./routes/page2');
var page3 = require('./routes/page3');

var app = express();


app.use(session({ secret: 'appsecret', saveUninitialized: true, resave: false, cookie: { secure: true, maxAge: new Date(Date.now() + 3600000) } }));
app.use(passport.initialize());
app.use(passport.session());

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
//var idpcert = fs.readFileSync('cert/idp-cert2.pem', 'utf-8');

var strategy = new saml_strategy({
    callbackUrl: 'https://etlog-dev.cesnet.cz:8444/login/callback',
    entryPoint: 'https://whoami-dev.cesnet.cz/idp/profile/SAML2/Redirect/SSO',
    issuer: 'https://etlog-dev.cesnet.cz/',
    protocol: 'https://',
    decryptionPvk: pvk,
    //ecryptionCert: cert,
    identifierFormat : 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    cert: idpcert,
    //privateCert: cert
  },
  function(profile, done) {
    console.log("strategy");
    console.log(profile);
    console.log("");
    done(null, profile);
  });

passport.use(strategy);


// --------------------------------------------------------------------------------------

//http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

passport.serializeUser(function(user, done) {   //  TODO
  //console.log("serializeUser");
  //console.log(user);

  var ret = {};

  // urn:oid:1.3.6.1.4.1.5923.1.1.1.6 - eduPersonPrincipalName (ePPN)
  ret.username = user["urn:oid:1.3.6.1.4.1.5923.1.1.1.6"];

  done(null, ret);
});

passport.deserializeUser(function(user, done) { // TODO
  console.log("deserializeUser");
  done(null, user);
});

// --------------------------------------------------------------------------------------

app.get('/login',
  passport.authenticate('saml')
);

app.post('/login/callback',
  passport.authenticate('saml'),
  function(req, res) {
    //console.log("post login callback");
    //console.log(req.user);
    //console.log("");
    //console.log("");
    //console.log(req.session.passport.user);
    //console.log("");
    res.redirect('/');
  }
);

// --------------------------------------------------------------------------------------
app.get('/metadata', function(req, res, next) {
  res.send(strategy.generateServiceProviderMetadata(cert));
});


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
