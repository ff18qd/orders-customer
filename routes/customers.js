var express = require('express')
var app = express()
 
// app.get('/', function(req, res) {
//     // render to views/index.ejs template file
//     res.render('index', {title: 'Customers Info'})
    
// })

app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT DISTINCT CustomerName, CustomerAddress FROM Orders ORDER BY CustomerName ASC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('customer/list', {
                    title: 'Customers List', 
                    data: ''
                })
            } else {
                // render to views/order/list.ejs template file
                res.render('customer/list', {
                    title: 'Customers List', 
                    data: rows
                })
            }
        })
    })
})



module.exports = app;