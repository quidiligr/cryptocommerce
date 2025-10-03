var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
const MyAccountController = require('../controller/myaccount.controller') 


router.get('/', MyAccountController.dashboard)

router.get('/dashboard/:tab', MyAccountController.dashboard)




router.get('/add-wallet', function(req, res, next) { 
    
    
    let data = {
        input:{
            walllet:'',
            is_default:false
            //email:'',
            //username:''
            }
    }
        res.render('myaccount/add-wallet',data)
  //  });
    
});


router.post('/add-wallet', MyAccountController.post_addwallet)


router.get('/edit-wallet/:id', MyAccountController.get_editwallet)


router.post('/edit-wallet', MyAccountController.post_editwallet)

router.get('/remove-wallet/:id', MyAccountController.removeWallet)

router.get('/change-password', MyAccountController.getChangepassword)
router.post('/change-password', MyAccountController.postChangepassword)

router.get('/edit-billing-address', MyAccountController.getEditBillingAddress)
router.post('/edit-billing-address', MyAccountController.postEditBillingAddress)

router.get('/edit-shipping-address', MyAccountController.getEditShippingAddress)
router.post('/edit-shipping-address', MyAccountController.postEditShippingAddress)

router.get('/edit-company-info', MyAccountController.getEditCompanyInfo)
router.post('/edit-company-info', MyAccountController.postEditCompanyInfo)


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

*/
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
