/*var db = req.db;
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
    */


//const DashboardService = require('../services/vendor/dashboard.service')

//const ProductService = require('../services/vendor/vendor.service')

const ProductService = require('../services/product.service')

exports.product_page = async function(req, res, next){
    console.log('37: START product.controller.product_page')
  
    
            let result = await ProductService.product_page(req.session,req.params)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }

exports.category_page = async function(req, res, next){
    console.log('61: START product.controller.category_page')
    
    
            let result = await ProductService.category_page(req.session,req.params)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                //console.log(`43: calling render product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/category-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }
    