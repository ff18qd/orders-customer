// https://medium.com/the-n00b-code-chronicles/how-to-deploy-a-node-js-web-app-using-express-in-cloud9-91e73910293f
// config the MySQL in C9
// use `sudo service mysqld start` to start MySQL server 
// https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/install-LAMP.html
// https://github.com/lcarbonaro/nodejs/blob/master/session27/server.js
// http://text-analytics101.rxnlp.com/2013/11/how-to-install-mysql-on-amazon-ec2.html

var express = require('express');
var mysql = require('mysql');
var app = express();

var dbHost = process.env.IP || 'localhost',
    // dbUser = process.env.C9_USER || 'root';
     dbUser = 'root'

var connection = mysql.createConnection({
    host     : dbHost,
    user     : dbUser,
    password : 'password123^^',
    database : 'c9'   // change if not on Cloud9
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
        
        
app.get('/', function (req, res) {
  res.send("<h1>hello world</h1>");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
  //call this app from https://<workspace name>-<user name>.c9users.io
});