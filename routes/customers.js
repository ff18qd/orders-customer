var express = require('express')
var app = express()
 
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

//Show edit order form
app.get('/edit/(:name)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query(`SELECT * FROM Orders WHERE CustomerName = \'${req.params.name}\'`, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Customer not found with CustomerName = ' + req.params.name)
                res.redirect('/customers')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('customer/edit', {
                    title: 'Edit Customer', 
                    //data: rows[0],
                    // OrderID: rows[0].OrderID,
                    CustomerName: rows[0].CustomerName,
                    CustomerAddress: rows[0].CustomerAddress,
                    // ItemName: rows[0].ItemName,
                    // Price: rows[0].Price,
                    // Currency: rows[0].Currency
                })
            }            
        })
    })
})


module.exports = app;