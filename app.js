var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
const config = require('./config/config')

async = require("async");

// Connect database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb:27017/cryptibuydb');

// Front-End
var home = require('./routes/home.route');
var product = require('./routes/product.route');
var cart = require('./routes/cart.route');
var account = require('./routes/account.route');
var myaccount = require('./routes/myaccount.route');
var brand = require('./routes/brand');
var order = require('./routes/order.route');
var offer = require('./routes/offer.route');
//var vendor = require('./routes/vendor');

// Back-End
var upload = require('./routes/upload.router');
/*
var loginAdmin = require('./routes/admin/login');
var categoryAdmin = require('./routes/admin/category');
var productAdmin = require('./routes/admin/product');
var brandAdmin = require('./routes/admin/brand');
var roleAdmin = require('./routes/admin/role');
var orderAdmin = require('./routes/admin/order');
var accountAdmin = require('./routes/admin/account');
var settingAdmin = require('./routes/admin/setting');
*/
// Back-End Vendor
var vendor = require('./routes/vendor.router');
var admin = require('./routes/admin.router');

// API
var api = require('./routes/api.route');

const hour = 3600000 * 24 //24 hrs

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// set the view engine to ejs
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: 'romcodes', cookie: { maxAge: hour }}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(fileUpload());

// Make our db accessible to our router
app.use(function(req, res, next){
    req.db = db;
    res.locals.session = req.session;
    next();
});

// Front-End
app.use('/',setGuestIfNeeded(), home);
app.use('/home',setGuestIfNeeded(), home);
app.use('/product',setGuestIfNeeded(), product);
app.use('/cart',setGuestIfNeeded(), cart);
app.use('/cart',setGuestIfNeeded(), order);

app.use('/account',setGuestIfNeeded(), account);
app.use('/myaccount',requireRole("customer"), myaccount);

//app.use('/vendor', vendor);
app.use('/brand',setGuestIfNeeded(), brand);

app.use('/upload',requireRole("customer"), upload);

app.use('/api', api);
app.use('/order',requireRole("customer"), order);
app.use('/offer',requireRole("customer"), offer);

// Back-End Vendor
app.use('/vendor', requireRole("customer"),vendor);
app.use('/admin', requireRoleAdmin("customer"),admin);

// Back-End
/*
app.use('/admin/login', loginAdmin);
app.use('/admin/category', requireRole("admin"), categoryAdmin);
app.use('/admin/product', requireRole("admin"), productAdmin);
app.use('/admin/brand', requireRole("admin"), brandAdmin);
app.use('/admin/role', requireRole("admin"), roleAdmin);
app.use('/admin/order', requireRole("admin"), orderAdmin);
app.use('/admin/account', requireRole("admin"), accountAdmin);
app.use('/admin/setting', requireRole("admin"), settingAdmin);
*/



function requireRole(role) {
    return function(req, res, next) {
      //console.log(`89: req.session= ${JSON.stringify(req.session,null,4)}`)
        //if(req.session.user && req.session.user.roleId === role)
        initGuestIfNeeded()
        if(req.session.username && req.session.roleId === role )
            next();
        else{
          req.session['return_url'] = req.headers.referer
          console.log(`111: return_url= ${req.session['return_url']}`)
            
            res.redirect('/account/login');
        }
    }
}

function requireRoleAdmin(role) {
  return function(req, res, next) {
    //console.log(`89: req.session= ${JSON.stringify(req.session,null,4)}`)
      //if(req.session.user && req.session.user.roleId === role)
      initGuestIfNeeded()
      if(req.session.username && req.session.roleId === role && req.session.is_admin)
          next();
      else{
        req.session['return_url'] = req.headers.referer
        console.log(`111: return_url= ${req.session['return_url']}`)
          
          res.redirect('/account/login');
      }
  }
}


function initGuestIfNeeded(req){
  try{
    if(req.session["user"] == null){
      req.session["roleId"] = 'guest'
      req.session["user"] = config.guest_user

      console.log(`114: req.session= ${JSON.stringify(req.session,null,4)}`)

      }
    }
    catch(ex){
      console.log(`109: ex= ${JSON.stringify(ex,null,4)}`)
    }
}

function setGuestIfNeeded() {
  return function(req, res, next) {
    //console.log(`107: req.session= ${JSON.stringify(req.session,null,4)}`)
      //if(req.session.user && req.session.user.roleId === role)
      initGuestIfNeeded(req)
        next();
  }
}


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

//app.listen(3000, 'localhost');