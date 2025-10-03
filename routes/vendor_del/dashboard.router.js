var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
/*
router.get('/sign-up', function(req, res, next) { 

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands');  
    var accountTable = db.get('accounts');  
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        res.render('account/register', data);
    });
    
});

router.post('/sign-up', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            accountTable.count({username: req.body.username}, function(e, count) {
                if(count == 0) {
                    bcrypt.hash(req.body.password, 13, function(err, hash) {
                        req.body.password = hash;
                        req.body.status = true;
                        req.body.roleId = 'customer';
                        accountTable.insert(req.body, function(err, result){
                            callback(null, {count: 0});                            
                        });
                    });
                } else {
                    callback(null, {count: count});
                }
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        var countAccount = results[2];
        if(countAccount.count == 0) {
            res.title = 'Login'; 
            res.render('account/login', data);
        } else {
            res.title = 'Register'; 
            data['message'] = 'Exits';
            res.render('account/register', data);
        }
    });
});

router.get('/login', function(req, res, next) { 
    
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        //res.render('account/login', data);
        res.render('account/login', data);
    });
});

router.post('/login', function(req, res, next) { 

    console.log('107: START /login')
    console.log(`108: ${JSON.stringify(req.body,null,4)}`)
    

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            
            
            let password = req.body.password
            let username =''
            let email = ''
            if(req.body.email.includes('@')){
                
                email=req.body.email
            }
            else{
                username =req.body.email
            }

            let qry_find = {}
            
            if(username){
                qry_find = {$and: [{username: username}, {status: true}, {roleId: 'customer'}]}
            }
            else{
                qry_find = {$and: [{email: email}, {status: true}, {roleId: 'customer'}]}
            }
            
            accountTable.findOne(qry_find, function(e, account){
                if(account != null) {
                    bcrypt.compare(password, account.password, function(err, res) {
                        if(res) {
                            req.session.username = account.username;
                            callback(null, {count: 1});
                        } else {
                            callback(null, {count: 0});
                        }
                    });
                } else {
                    callback(null, {count: 0});
                }
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        var countAccount = results[2];
        if(countAccount.count == 0) {
            console.log('80: /login FAILED')
            data['message'] = 'Invalid Account'
            res.render('account/login')
            //res.redirect('/')
        } else {
            console.log('80: /login OK')
            //res.redirect('/account/orders')
            res.redirect('/account/dashboard')
            //res.redirect('/');
        }
        
    });
});

router.get('/logout', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            delete req.session.username;
            callback();
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        res.render('account/login', data);
    });
});

router.get('/change-profile', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            accountTable.findOne({username: req.session.username}, function(e, account){
                callback(null, account);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], account: results[2] };
        res.render('account/change_profile', data);
    });
});

router.post('/change-profile', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            accountTable.findOne({username: req.session.username}, function(e, account) {
                if(req.body.password != '') {
                    bcrypt.hash(req.body.password, 13, function(err, hash) {                        
                        accountTable.update({username: req.session.username}, {$set : {password: hash, fullName: req.body.fullName, email: req.body.email}}, function(e, result) {
                            accountTable.findOne({username: req.session.username}, function(e, account) {
                                callback(null, account);
                            });
                        });
                    });
                } else {                    
                    accountTable.update({username: req.session.username}, {$set : {fullName: req.body.fullName, email: req.body.email}}, function(e, result) {
                        accountTable.findOne({username: req.session.username}, function(e, account) {
                            callback(null, account);
                        });
                    });
                }
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], account: results[2] };
        res.render('account/change_profile', data);
    });
});


router.get('/dashboard', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('account/dashboard', data);
    });
});
*/

/*
router.get('/', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('vendor/dashboard', data);
    });
});
*/
const DashBoardController = require('../../controllers/vendor/dashboard.controller') 

router.get('/', DashBoardController.index)

router.get('/product-list', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('vendor/product-list', data);
    });
});

router.get('/add-product', function(req, res, next) { 
    console.log('373: START /add-product')
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('vendor/add-product', data);
    });
});

router.get('/product-detail', function(req, res, next) { 
    console.log('373: START /add-product')
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('vendor/product-detail', data);
    });
});

router.get('/orders', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('account/orders', data);
    });
});

router.get('/order/detail/:id', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    var ordersDetailTable = db.get('orderdetails');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback) {
          
            ordersDetailTable.aggregate({
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"id",
                    as:"productInfo"
                }                
            }, function(e, result) { 
                    var orderDetails = [];
                    for(var i = 0; i < result.length; i++) {
                        if(result[i].orderId == req.params.id) {
                            orderDetails.push(result[i]);
                        }
                    }
                    callback(null, orderDetails);
            });
            
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orderDetails: results[2] };
        res.render('account/orders_detail', data);
    });
});


module.exports = router;
