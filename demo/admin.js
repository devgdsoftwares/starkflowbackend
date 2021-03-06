const express = require('express');
global.path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const session = require('express-session');
const nunjucks = require('nunjucks');
const fileUpload = require('express-fileupload');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
require('dotenv').load();

global.flash = require('connect-flash');
global.fs = require('fs');


global.admin_url = process.env.ADMIN_URL;
global.UPLOAD_PATH = process.env.UPLOAD_PATH;
global.IMAGE_BASE = process.env.IMAGE_BASE;


var index = require('./admin/routes/index');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'admin/views'));
app.set('view engine', 'html');

var env = nunjucks.configure('admin/views', {
	autoescape: true,
	watch: true,
	express: app
});

env.addFilter('dateFilter', function(time, length) {
    return  time && time != '' && time.toDateString() ? time.toDateString() : '';
});


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'publics')));
app.use(fileUpload());
app.use(session({
    cookie: {
        maxAge: 60000000000
    },
    secret: '57065d0113918ca402a0f2ad57065d0113918ca402a0f2ad',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(function(req, res, next) {

  res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');	
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, os, version, ssid, access_token ");
	// console.dir({
	// 	body: req.body, 
	// 	params: req.params,
	// 	query: req.query,
	// 	query: req.headers
	// });
  next();
});
app.use(methodOverride())

app.use((req, res, next)=>{
	res.locals.error_flash = req.flash('error')[0];
  	res.locals.success_flash = req.flash('success')[0];
	res.locals.error = req.flash('error').toString()
    res.locals.success = req.flash('success').toString();
	res.locals.host = process.env.HOST
	res.locals.admin_url = process.env.ADMIN_URL;
	res.locals.image_url = process.env.IMAGE_URL;
	res.locals.admin_image_url = process.env.ADMIN_IMAGE_URL;
	res.locals.user = req.session.user;

	/*console.dir({ 
		path: req.originalUrl, 
		body: req.body, 
		params: req.params,
		query: req.query
	});*/
	next()
});
//	non auth (public) function are here
app.use('/', index);

fs.readdirSync(path.join(__dirname, 'admin', 'routes'))
	.forEach(function(filename) {  
	if (filename.indexOf('.') != 0 || filename != 'index.js') 
	{
		var route = require(path.join(__dirname, 'admin','routes', filename))
		app.use('/admin', route);
	}
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);

});

// error handler
app.use(function(err, req, res, next) {
	console.error("app error handler called", err);
});

module.exports = app;

