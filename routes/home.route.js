var express = require('express');
var router = express.Router();

const HomeController = require('../controller/home.controller') 

router.get('/', HomeController.index)
router.get('/dashboard', HomeController.dashboard)
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
        res.render('home/dashboard', data);
    });
});


router.get('/', function(req, res, next) { 

    
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands');    
    var productTable = db.get('products');
    var settingTable = db.get('settings');
    var recentlyviewedTable = db.get('recentlyviewed');
    
    
    let username = req.session.username
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                //ROM: return 2 formats of category one is flat and the subcategory array
                let menu_categories = []
                if(categories && categories.length > 0){
                    
                    categoryTable.find({status: true},{}, function(e, categories){
                            
                            callback(null, categories);
                        });            
                    

                }
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        
        function(callback){
            settingTable.findOne({key: 'featured_products'},{}, function(e, setting){
                productTable.find({status: true}, { limit : setting.value, sort : { id : -1 } }, function(e, products){
                    if(products == null){
                        products = []
                    }
                    callback(null, products);
                });
            });
        },
        
        
        
        function(callback){
            settingTable.findOne({key: 'deals_of_the_day'},{}, function(e, setting){
                productTable.find({status: true,is_published:true, is_dealoftheday:true}, { limit : setting.value, sort : { id : -1 } }, function(e, products){
                    if(products == null){
                        products = []
                    }
                    callback(null, products);
                });
            });
        },
        function(callback){
            settingTable.findOne({key: 'on_sale_products'},{}, function(e, setting){
                productTable.find({status: true, is_published:true,is_onsale:true}, { limit : setting.value, sort : { id : -1 } }, function(e, products){
                    if(products == null){
                        products = []
                    }
                    callback(null, products);
                });
            });
        },
        function(callback){
            if(username){
                settingTable.findOne({key: 'your_recently_viewed_items'},{}, function(e, setting){
                    recentlyviewedTable.find({}, { limit : setting.value, sort : { id : -1 } }, function(e, recentlyviewed){
                        if(recentlyviewed == null){
                            recentlyviewed = []
                        }
                        callback(null, recentlyviewed);
                    });
                });
            } else{
                callback(null, []);
            }
        },
        function(callback){
            settingTable.findOne({key: 'new_products'},{}, function(e, setting){
                productTable.find({status: true, is_published:true,is_new:true}, { limit : setting.value, sort : { id : -1 } }, function(e, products){
                    if(products == null){
                        products = []
                    }
                    callback(null, products);
                });
            });
        },
        function(callback){
            if(username){
                settingTable.findOne({key: 'featured_categories'},{}, function(e, setting){
                    categoryTable.find({}, { limit : setting.value, sort : { id : -1 } }, function(e, featured_categories){
                        if(featured_categories == null){
                            featured_categories = []
                        }
                        callback(null, featured_categories);
                    });
                });
            } else{
                callback(null, []);
            }
        },
        
        

    ], 
    function(err, results) {
        var s = req.session.cart == null ? 0 : req.session.cart.length;
    var sum = 0;
    if(req.session.cart != null){
        for( item of req.session.cart) { 
        
            sum += item.product.price * item.quantity

         }
        }
    
        
    let    home_slider = [{
            title:'special price',
            subtitle: 'save 30%',
            text: 'shop now',
            //img:"/assets/images/electronics/home-slider/1.jpg"
            img:"/uploads/images/electronics/home-slider/1.jpg"
            
        },
        {
            title:'must have',
            subtitle: 'save 30%',
            text: 'shop now',
            img:"/uploads/images/electronics/home-slider/2.jpg"
            
        }
    ]
    

    
        var data = {
            categories: results[0], 
            brands: results[1], 
            products: results[2], 
            deals_of_the_day: results[3], 
            on_sale_products: results[4], 
            your_recently_viewed_items: results[5],
            new_products: results[6],
            
            featured_categories: results[7],
            
            currentUrl: 'home', 
            cart:{count:s, sum:sum,},
            
            home_slider: home_slider,
            user:{username: req.session.username != null ? req.session.username: ''}
        }
        
        
        //res.render('home/index', data);
        res.render('home/index', data)
        
    });
       
});

*/

module.exports = router;
