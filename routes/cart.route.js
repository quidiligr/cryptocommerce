var express = require('express');
var router = express.Router();
//const crypto = require('crypto')
const CartController = require('../controller/cart.controller')

router.get('/', CartController.index)
//router.get('/checkout', CartController.checkout)
/*
router.get('/', function(req, res, next) { 

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands');
    var settingTable = db.get('settings'); 
       
    
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
            settingTable.find({group: 'paypal'},{}, function(e, settings){
                callback(null, settings);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], settings: results[2]};
        res.render('cart/index', data);
    });  
});

*/

router.get('/add/:id', function(req, res, next) { 

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands');    
    var productTable = db.get('products');
    var settingTable = db.get('settings'); 
    
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
            //productTable.findOne({id: req.params.id}, function(e, product){
                productTable.findOne({id: req.params.id}, function(e, product){
                if(product == null){
                    callback(null,null);
                }
                //ROM: exclude long text
                product = {id:product.id, name:product.name, price:product.price}
                
                if(req.session.cart == null) {
                    req.session.cart = [{product: product, quantity: 1}];
                } else {
                    console.log(`59: ${JSON.stringify(req.session.cart,null,4)}`)
                    console.log(`59: ${JSON.stringify(product,null,4)}`)
                    var index = -1;
                    for(var i = 0; i < req.session.cart.length; i++) {
                        //if(req.session.cart[i].product.id == product.id) {
                            
                        if(req.session.cart[i].product.id == product.id) {
                            index = i;
                            break;
                        }
                    }
                    if(index == -1) {
                        req.session.cart.push({
                            product: product, quantity: 1
                        });
                    } else {
                        req.session.cart[index].quantity++;
                    }
                }
                callback(null, req.session.cart);
            });
        },
        function(callback){
            settingTable.find({group: 'paypal'},{}, function(e, settings){
                callback(null, settings);
            });
        }
    ], 
    function(err, results) {
        if(results[2] == null){
                console.log('92: Error add to cart. Invalid product!')
            return res.redirect('/error');
        }
        //var data = {categories: results[0], brands: results[1], cart: results[2], settings: results[3], };
        //res.render('cart/index', data);
        res.redirect('/');
    });  
});

router.get('/delete/:index', function(req, res, next) { 

    //var db = req.db;
    //var categoryTable = db.get('categories'); 
    //var brandTable = db.get('brands');    
    //var productTable = db.get('products');
    //var settingTable = db.get('settings'); 
    
    async.parallel([
        /*function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        */
        function(callback){
            
                if(req.session.cart != null) {
                    var index = parseInt(req.params.index);
                    req.session.cart.splice(index, 1);
                }
                callback(null, req.session.cart);
            
        },
        /*
        function(callback){
            settingTable.find({group: 'paypal'},{}, function(e, settings){
                callback(null, settings);
            });
        }
        */
    ], 
    function(err, results) {
        //var data = {categories: results[0], brands: results[1], cart: results[2], settings: results[3]};
        //res.render('cart/index', data);
        res.redirect('/')
    });  
});
/*
router.get('/success', function(req, res, next) { 

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands');    
    var productTable = db.get('products');
    var orderTable = db.get('orders');
    var orderDetailsTable = db.get('orderdetails');
    
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
            // Insert new order
            // pending, shipping, complete, canceled
            orderTable.insert({id: req.query.tx, created: new Date().toLocaleDateString(), username: req.session.username, status: 'pending'}, function(error, result){
                var orderdetails = [];
                for(var i = 0; i < req.session.cart.length; i++) {
                    orderdetails.push({
                        orderId: req.query.tx,
                        productId: req.session.cart[i].product.id,
                        price: req.session.cart[i].product.price,
                        quantity: req.session.cart[i].product.quantity
                    });
                }
                orderDetailsTable.insert(orderdetails, function(error, result){
                    // Remove cart
                    delete req.session.cart;
                    callback();
                });
                
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1]};
        res.render('cart/thanks', data);
    });  
});
*/


router.post('/success', function(req, res, next) { 

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands');    
    var productTable = db.get('products');
    var orderTable = db.get('orders');
    var orderDetailsTable = db.get('orderdetails');

    console.log(`185: START POST /success req.body= ${JSON.stringify(req.body,null,4)}`)
    console.log(`185: req.session= ${JSON.stringify(req.session,null,4)}`)
   
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
            // Insert new order
            // pending, shipping, complete, canceled
           
            try{
                let transaction_hash_str = req.body['transaction_hash'] != null ? req.body['transaction_hash'] : '';
            if(transaction_hash_str.length == 0){
                return callback('Invalid transaction_hash_str.')
            }
            let id = crypto.createHash('md5').update(transaction_hash_str).digest("hex")

            if(id == null){
                return callback('error creating id!')
            }
            let transaction_hash = JSON.parse(transaction_hash_str)
            orderTable.insert({
                id: id,//req.query.tx, 
                created: new Date().toLocaleDateString(), 
                username: req.session.user.username, 
                status: 'pending',
                seller_wallet:  req.body['seller_wallet'] != null ? req.body['seller_wallet'] : '', 
                transaction_hash_str: transaction_hash_str,
                transaction_hash: transaction_hash

            }, function(error, result){
                if(error){
                    console.log(`224: error= ${error}`)
                    callback(error);


                }
                var orderdetails = [];
                for(var i = 0; i < req.session.cart.length; i++) {
                    orderdetails.push({
                        orderId: i+1,//req.query.tx,
                        productId: req.session.cart[i].product.id,
                        price: req.session.cart[i].product.price,
                        //quantity: req.session.cart[i].product.quantity
                        quantity: req.session.cart[i].quantity
                    });
                }
                orderDetailsTable.insert(orderdetails, function(error, result){
                    // Remove cart
                    delete req.session.cart;
                    return callback(null,transaction_hash);
                });
                
            });

            }
            catch(error){
                console.log(`error= ${error}`)
                return callback(error)

            }
            
        }
    ], 
    function(err, results) {
        if(err){
            res.redirect('/cart/failed');
        }
        else{
            let hash =  results[2]
            let transact = {
                'Block Hash': hash['blockHash'],
                'Block Number': hash['blockNumber'],
                'Gas Price': hash['effectiveGasPrice'],
                'Gas Used': hash['gasUsed'],
                'Buyer Wallet': hash['from'],
                'Seller Wallet': hash['to'],
                'Transaction Hash': hash['transactionHash'],
                
                
            }
            var data = {categories: results[0], brands: results[1], transact: transact };
        res.render('cart/thanks', data);
        }
        
    });  
});


router.get('/failed', function(req, res, next) { 

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
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1]};
        res.render('cart/failed', data);
    });  
});

module.exports = router;
