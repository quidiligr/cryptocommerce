var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
const AccountController = require('../controller/account.controller') 
/*
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

router.get('/login', AccountController.get_login)
/*
router.get('/verify-email', function(req, res, next) { 
    
    
        let data = {
            input:{
                code:'',
                email:'',
                username:''
                }
        }
            res.render('account/verify-email',data)
      //  });
        
    });
*/
//router.get('/sign-up', function(req, res, next) { 
router.get('/register', function(req, res, next) { 

       let data = {
        register:{
            fname:'',
            lname:'',
            username:'',
            email:'',
            password:'',
            phone:''},
            error:{message:''}
    }
        res.render('account/register',data)
  //  });
    
});


router.post('/register',  AccountController.post_register) 

//router.post('/verify-email',  AccountController.post_verify_email) 

router.get('/verify-email', function(req, res, next) { 
    
    
    let data = {
        input:{
            code:'',
            email:'',
            username:''
            }
    }
        res.render('account/verify-email',data)
  //  });
    
});


router.post('/verify-email',  AccountController.post_verify_email) 



router.post('/login', AccountController.post_login) 

//router.get('/add-wallet', AccountController.post_addwallet)


/*

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
            delete req.session.user;
            
            callback();
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        res.redirect('/');
    });
});
*/
/*
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
*/
module.exports = router;
