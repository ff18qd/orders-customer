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

var express = require('express');
var mysql = require('mysql');
var app = express();
var url = require('url');

var dbHost = process.env.IP || 'localhost',
    // dbUser = process.env.C9_USER || 'root';
     dbUser = 'root'

var connection = mysql.createConnection({
    host     : dbHost,
    user     : dbUser,
    password : 'password123^^',
    database : 'c9'   // change if not on Cloud9
});

app.set('view engine', 'ejs');

var index = require('./routes/index');
var orders = require('./routes/orders');

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
// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// connection.connect(function(err) {
//   if (err) throw err;
//   connection.query("SELECT * FROM Orders", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });     

// select by customer name
connection.connect(function(err) {
  if (err) throw err;
  connection.query("SELECT * FROM Orders WHERE CustomerName = 'Peter Lustig'; ", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
}); 
        
// app.get('/', function (req, res) {
//   res.send("<h1>hello world</h1>");
// });

// app.get('/', function(req, res) {
//     // render to views/index.ejs template file
//     res.render('index', {title: 'My Node.js Application'})
// })

app.use('/', index);
app.use('/orders', orders);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
  //call this app from https://<workspace name>-<user name>.c9users.io
});


