var express = require('express')
var app = express()

app.get('/count', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(`SELECT COUNT(ItemName), ItemName FROM Orders GROUP BY ItemName ORDER BY COUNT(ItemName) DESC, ItemName ASC;`,function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('order/count', {
                    title: 'Orders List by Item Count', 
                    data: ''
                })
            } else {
                // render to views/order/count.ejs template file
                res.render('order/count', {
                    title: 'Orders List by Item Count ', 
                    data: rows
                })
            }
        })
    })
})


app.get('/customer/(:cusName)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(`SELECT * FROM Orders WHERE CustomerName = \'${req.params.cusName}\' ORDER BY OrderID ASC`,function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('order/list', {
                    title: 'Orders List by ' + req.params.cusName, 
                    data: ''
                })
            } else {
                // render to views/order/list.ejs template file
                res.render('order/list', {
                    title: 'Orders List by ' + req.params.cusName, 
                    data: rows
                })
            }
        })
    })
})



app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM Orders ORDER BY OrderID ASC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('order/list', {
                    title: 'Orders List', 
                    data: ''
                })
            } else {
                // render to views/order/list.ejs template file
                res.render('order/list', {
                    title: 'Orders List', 
                    data: rows
                })
            }
        })
    })
})


// SHOW ADD Order FORM
app.get('/add', function(req, res, next){	
	// render to views/order/add.ejs
	res.render('order/add', {
		title: 'Add New Order',
		OrderID: '',
		CustomerName: '',
		CustomerAddress: '',
		ItemName: '',
		Price: '',
		Currency: ''		
	})
});

// ADD NEW Order POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('OrderID', 'OrderID is required').notEmpty()           //Validate OrderID
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
		var order = {
		    OrderID: req.sanitize('OrderID').escape().trim(),
			CustomerName: req.sanitize('CustomerName').escape().trim(),
			CustomerAddress: req.sanitize('CustomerAddress').escape().trim(),
			ItemName: req.sanitize('ItemName').escape().trim(),
			Price: req.sanitize('Price').escape().trim(),
			Currency: req.sanitize('Currency').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO Orders SET ?', order, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('order/add', {
						title: 'Add New Order',
						OrderID: order.OrderID,
						CustomerName: order.CustomerName,
						CustomerAddress: order.CustomerAddress,
						ItemName: order.ItemName,
						Price: order.Price,
						Currency: order.Currency					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('order/add', {
						title: 'Add New Order',
						OrderID: '',
                		CustomerName: '',
                		CustomerAddress: '',
                		ItemName: '',
                		Price: '',
                		Currency: ''					
					})
				}
			})
		})
	}
	else {   //Display errors to order
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('order/add', { 
            title: 'Add New Order',
            OrderID: req.body.OrderID,
            CustomerName: req.body.CustomerName,
            CustomerAddress: req.body.CustomerAddress,
            ItemName: req.body.ItemName,
            Price:req.body.Price,
            Currency:req.body.Currency
        })
    }
})

app.get('/address/(:address)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(`SELECT * FROM Orders WHERE CustomerAddress = \'${req.params.address}\' ORDER BY OrderID ASC`,function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('order/list', {
                    title: 'Orders List by ' + req.params.address, 
                    data: ''
                })
            } else {
                // render to views/order/list.ejs template file
                res.render('order/list', {
                    title: 'Orders List by ' + req.params.address, 
                    data: rows
                })
            }
        })
    })
})

//Show edit order form
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM Orders WHERE OrderID = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Order not found with OrderID = ' + req.params.id)
                res.redirect('/orders')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('order/edit', {
                    title: 'Edit Order', 
                    //data: rows[0],
                    OrderID: rows[0].OrderID,
                    CustomerName: rows[0].CustomerName,
                    CustomerAddress: rows[0].CustomerAddress,
                    ItemName: rows[0].ItemName,
                    Price: rows[0].Price,
                    Currency: rows[0].Currency
                })
            }            
        })
    })
})

// EDIT Order POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('OrderID', 'OrderID is required').notEmpty()           //Validate name
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
		var order = {
		    OrderID: req.sanitize('OrderID').escape().trim(),
			CustomerName: req.sanitize('CustomerName').escape().trim(),
			CustomerAddress: req.sanitize('CustomerAddress').escape().trim(),
			ItemName: req.sanitize('ItemName').escape().trim(),
			Price: req.sanitize('Price').escape().trim(),
			Currency: req.sanitize('Currency').escape().trim()
		}
		
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE Orders SET ? WHERE OrderID = ' + req.params.id, order, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/order/add.ejs
					res.render('order/edit', {
						title: 'Edit Order',
						OrderID: req.params.OrderID,
						CustomerName: req.params.CustomerName,
						CustomerAddress: req.body.CustomerAddress,
						ItemName: req.body.ItemName,
						Price: req.body.Price,
						Currency: req.body.Currency
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/order/add.ejs
					res.render('order/edit', {
						title: 'Edit Order',
						OrderID: req.params.OrderID,
						CustomerName: req.params.CustomerName,
						CustomerAddress: req.body.CustomerAddress,
						ItemName: req.body.ItemName,
						Price: req.body.Price,
						Currency: req.body.Currency
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
        res.render('user/edit', { 
            title: 'Edit User',            
			OrderID: req.body.OrderID,
            CustomerName: req.body.CustomerName,
            CustomerAddress: req.body.CustomerAddress,
            ItemName: req.body.ItemName,
            Price:req.body.Price,
            Currency:req.body.Currency
        })
    }
})

// DELETE Order
app.delete('/delete/(:id)', function(req, res, next) {
    var order = { OrderID: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM Orders WHERE OrderID = ' + req.params.id, order, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/orders')
            } else {
                req.flash('success', 'Order is deleted successfully! OrderID = ' + req.params.id)
                // redirect to users list page
                res.redirect('/orders')
            }
        })
    })
})
 
 
 

module.exports = app;