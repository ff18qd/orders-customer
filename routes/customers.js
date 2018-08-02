var express = require('express')
var app = express()
 
app.get('/sum/(:name)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(`select CustomerName, Sum(Price) AS Sum, Currency from Orders where CustomerName = \'${req.params.name}\' GROUP BY Currency`, req.params.name, function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('customer/sum', {
                    title: 'Total money Spent by ' + req.params.name, 
                    data: ''
                })
            } else {
                // render to views/customer/sum.ejs template file
                res.render('customer/sum', {
                    title: 'Total money Spent by ' + req.params.name, 
                    data: rows
                })
            }
        })
    })
})

app.get('/item/(:itemName)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(`select CustomerName, ItemName from Orders where ItemName = \'${req.params.itemName}\'`, req.params.itemName, function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('customer/item', {
                    title: 'Customers List By ' + req.params.itemName, 
                    data: ''
                })
            } else {
                // render to views/customer/item.ejs template file
                res.render('customer/item', {
                    title: 'Customers List By ' + req.params.itemName,  
                    data: rows
                })
            }
        })
    })
})

app.get('/order/(:cusName)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(`select CustomerName, OrderID, ItemName from Orders where CustomerName = \'${req.params.cusName}\'`, req.params.cusName, function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('customer/order', {
                    title: req.params.cusName + ' Orders', 
                    data: ''
                })
            } else {
                // render to views/customer/order.ejs template file
                res.render('customer/order', {
                    title: req.params.cusName  + ' Orders',  
                    data: rows
                })
            }
        })
    })
})
 
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
                // render to views/customer/list.ejs template file
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
                // render to views/customer/edit.ejs template file
                res.render('customer/edit', {
                    title: 'Edit Customer', 
                    CustomerName: rows[0].CustomerName,
                    CustomerAddress: rows[0].CustomerAddress,
                
                })
            }            
        })
    })
})

// EDIT Order POST ACTION
app.put('/edit/(:name)', function(req, res, next) {
	req.assert('CustomerName', 'Customer name is required').notEmpty()             //Validate Customer Name
    req.assert('CustomerAddress', 'A valid address is required').notEmpty()  //Validate customer address

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';
		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var customerUpdated = {
			CustomerName: req.sanitize('CustomerName').escape().trim(),
			CustomerAddress: req.sanitize('CustomerAddress').escape().trim(),
		}
		
		
		req.getConnection(function(error, conn) {
			conn.query(`UPDATE Orders SET CustomerName = \'${customerUpdated.CustomerName}\', CustomerAddress = \'${customerUpdated.CustomerAddress}\' WHERE CustomerName = \'${req.params.name}\'`, customerUpdated, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/customer/edit.ejs
					res.render('customer/edit', {
						title: 'Edit Customer Info',
						CustomerName: req.params.CustomerName,
						CustomerAddress: req.body.CustomerAddress,
					
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/customer/edit.ejs
					res.render('customer/edit', {
						title: 'Edit Customer Info',
						CustomerName: req.body.CustomerName,
						CustomerAddress: req.body.CustomerAddress
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('customer/edit', { 
            title: 'Edit Customer',            
            CustomerName: req.body.CustomerName,
            CustomerAddress: req.body.CustomerAddress,
        })
    }
})

// UPDATE Orders SET CustomerName = 'Peter Lustig', CustomerAddress="100 broadway"  WHERE CustomerName='Peetee Lucus';

// DELETE Customer
app.delete('/delete/(:name)', function(req, res, next) {
    var order = { CustomerName: req.params.name }
    
    req.getConnection(function(error, conn) {
        conn.query(`DELETE FROM Orders WHERE CustomerName = \'${req.params.name}\'`, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/customers')
            } else {
                req.flash('success', 'Customer is deleted successfully! Customer Name = ' + req.params.name)
                // redirect to users list page
                res.redirect('/customers')
            }
        })
    })
})

module.exports = app;