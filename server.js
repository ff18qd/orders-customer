var express = require('express');
var mysql = require('mysql');
var app = express();
var url = require('url');

/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))

app.set('view engine', 'ejs');

var index = require('./routes/index');
var orders = require('./routes/orders');
var customers = require('./routes/customers')


/**
 * Express Validator Middleware for Form Validation
 */ 
var expressValidator = require('express-validator')
app.use(expressValidator());

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var methodOverride = require('method-override');

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));


var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use('/', index);
app.use('/orders', orders);
app.use('/customers', customers);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
  //call this app from https://<workspace name>-<user name>.c9users.io
});


// https://medium.com/the-n00b-code-chronicles/how-to-deploy-a-node-js-web-app-using-express-in-cloud9-91e73910293f
// config the MySQL in C9
// sudo chkconfig mysqld on
// sudo service mysqld start
// mysql -u root -p
// use `sudo service mysqld start` to start MySQL DB server 
// https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/install-LAMP.html
// https://github.com/lcarbonaro/nodejs/blob/master/session27/server.js
// http://text-analytics101.rxnlp.com/2013/11/how-to-install-mysql-on-amazon-ec2.html
// http://blog.chapagain.com.np/node-js-express-mysql-simple-add-edit-delete-view-crud/
// https://github.com/chapagain/nodejs-mysql-crud