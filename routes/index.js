var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    // render to views/index.ejs template file
    res.render('index', {title: 'My Node.js Application 101'})
    
})



module.exports = app;