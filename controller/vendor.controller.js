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

const VerdorService = require('../services/vendor.service')

exports.dashboard = async function(req, res, next){


 
    /*
    router.get('/', function(req, res, next) { 
    var db = req.db;
    var productTable = db.get('products'); 
    var brandTable = db.get('brands'); 
    productTable.find({}, {}, function(error, result){
        //res.render('admin/product/index', {products: result, currentUrl:'product'});
        res.render('vendor/product-list', {products: result, currentUrl:'product'});
    });       
});
    */

    
    console.log('\r\n 53: START vendor.controller exports.dashboard \r\n')
    console.log(`\r\n 54: req.session=${JSON.stringify(req.session,null,4)} \r\n`)
    console.log(`\r\n 55: req.body=${JSON.stringify(req.body,null,4)} \r\n`)
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
 
    try{

 
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await VerdorService.dashboard(req.session, req.body)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            res.render('vendor/dashboard', result.data);
        }
        else{
            res.render('vendor/error');
        }
        
        
    
    }catch(err){

        console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
        //throw Error(e)
        //res.status(500).json({error:config.kERROR_100})
        res.render('vendor/error');
    }
//})
}


exports.product_list = async function(req, res, next){
 
    /*
    router.get('/', function(req, res, next) { 
    var db = req.db;
    var productTable = db.get('products'); 
    var brandTable = db.get('brands'); 
    productTable.find({}, {}, function(error, result){
        //res.render('admin/product/index', {products: result, currentUrl:'product'});
        res.render('vendor/product-list', {products: result, currentUrl:'product'});
    });       
});
    */
    
    console.log('\r\n 101: --------------------- vendor.controller.js products START ---------------------\r\n')
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
 
        try{

 
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await VerdorService.product_list(req.session,req.body)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.render('vendor/product-list', result.data);
        }
        else{
            res.render('/error');
        }
        
        
    
    }catch(err){

        console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
        //throw Error(e)
        //res.status(500).json({error:config.kERROR_100})
        res.render('/error');
    }
//})
}

exports.add_product = async function(req, res, next){
console.log('373: START vendor.controller.add_product')
/*
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
    */
    //console.log('\r\n --------------------- product.controller.js index START ---------------------\r\n')
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
 
        //try{

 
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await VerdorService.add_product(req.session,req.body)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.redirect(`/vendor/edit-product/${result.data.guid}`)
            //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
        }
        else{
            res.render('vendor/error');
        }
        
        
    
    //}catch(err){

    //    console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
        //throw Error(e)
        //res.status(500).json({error:config.kERROR_100})
        //res.render('vendor/error');
    //}
}

exports.remove_product = async function(req, res, next){
    console.log('193: START vendor.controller.remove_product')
    /*
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
        */
        //console.log('\r\n --------------------- product.controller.js index START ---------------------\r\n')
            
        //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
            
     
            //try{
    
     
            //let result = await APIService.messenger(req.params.apiKey, req.body)
            let result = await VerdorService.remove_product(req.session,req.params)
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`234: calling render vendor/remove_product, ${JSON.stringify(result.data,null,4)}`)
                //res.render('vendor/edit-product',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
                res.redirect(`/vendor/product-list`)
            }
            else{
                res.render('vendor/error');
            }
            
            
        
        //}catch(err){
    
        //    console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
            //throw Error(e)
            //res.status(500).json({error:config.kERROR_100})
            //res.render('vendor/error');
        //}
    }
    

exports.edit_product = async function(req, res, next){
    console.log('193: START vendor.controller.edit_product')
  
    
            let result = await VerdorService.edit_product(req.session,req.params)
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`234: calling render vendor/edit_product, ${JSON.stringify(result.data,null,4)}`)
                res.render('vendor/edit-product',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('vendor/error');
            }
            
            
            
}

exports.edit_product_page = async function(req, res, next){
    console.log('193: START vendor.controller.edit_product_page')
  
    
            let result = await VerdorService.edit_product(req.session,req.params)
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`234: calling render vendor/edit_product, ${JSON.stringify(result.data,null,4)}`)
                res.render('vendor/edit-product-page',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('vendor/error');
            }
}


exports.product_detail = async function(req, res, next){
    console.log('193: START vendor.controller.product_detail')
    
        
          
    let result = await VerdorService.product_detail(req.session,req.params)
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`234: calling render vendor/product_detail, ${JSON.stringify(result.data,null,4)}`)
                res.render('vendor/product-detail',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('vendor/error');
            }
            
            
            
    }
exports.save_product = async function(req, res, next){
    console.log('254: START vendor.controller.save_product')
    console.log(`255: ${JSON.stringify(req.body,null,4)}`)
    
    let result = await VerdorService.save_product(req)
    if(result.statusCode == 200){
        //res.status(result.statusCode).json(result.data)
        res.redirect(`/vendor/edit-product/${result.data.guid}`)
        //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
    }
    else{
        res.render('vendor/error');
    }
            
          
            
    }

exports.save_product_page = async function(req, res, next){
    console.log('254: START vendor.controller.save_product_page')
    console.log(`255: ${JSON.stringify(req.body,null,4)}`)
    
    let result = await VerdorService.save_product(req)
    if(result.statusCode == 200){
        //res.status(result.statusCode).json(result.data)
        res.redirect(`/vendor/edit-product-page/${result.data.guid}`)
        //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
    }
    else{
        res.render('vendor/error');
    }
            
            
            
    }
    

exports.order_list = async function(req, res, next){

    /*
    router.get('/', function(req, res, next) { 
    var db = req.db;
    var productTable = db.get('products'); 
    var brandTable = db.get('brands'); 
    productTable.find({}, {}, function(error, result){
        //res.render('admin/product/index', {products: result, currentUrl:'product'});
        res.render('vendor/product-list', {products: result, currentUrl:'product'});
    });       
});
    */
    
    console.log('\r\n 101: --------------------- vendor.controller.js order_list START ---------------------\r\n')
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
    
        try{

    
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await VerdorService.order_list(req.session,req.body)
        console.log(`vendor.controller order_list result= ${JSON.stringify(result,null,4)}`)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.render('vendor/order-list', result.data);
        }
        else{
            res.render('/error');
        }
        
        
    
    }catch(err){

        console.log('!!!!! 50: vendor.controller order-list ERROR: ' + JSON.stringify(err.stack));
        //throw Error(e)
        //res.status(500).json({error:config.kERROR_100})
        res.render('/error');
    }
//})
}

exports.offer_list = async function(req, res, next){

    /*
    router.get('/', function(req, res, next) { 
    var db = req.db;
    var productTable = db.get('products'); 
    var brandTable = db.get('brands'); 
    productTable.find({}, {}, function(error, result){
        //res.render('admin/product/index', {products: result, currentUrl:'product'});
        res.render('vendor/product-list', {products: result, currentUrl:'product'});
    });       
});
    */
    
    console.log('\r\n 101: --------------------- vendor.controller.js offer_list START ---------------------\r\n')
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
    
        try{

    
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await VerdorService.offer_list(req.session,req.body)
        console.log(`vendor.controller offer_list result= ${JSON.stringify(result,null,4)}`)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.render('vendor/offer-list', result.data);
        }
        else{
            res.render('/error');
        }
        
        
    
    }catch(err){

        console.log('!!!!! 50: vendor.controller offer_list ERROR: ' + JSON.stringify(err.stack));
        //throw Error(e)
        //res.status(500).json({error:config.kERROR_100})
        res.render('/error');
    }
//})
}

/*
exports.upload = async function(req, res, next){
    console.log('193: START vendor.controller.upload')
    let result = await VerdorService.save_product(req)
    if(result.statusCode == 200){
        //res.status(result.statusCode).json(result.data)
        res.redirect(`/vendor/edit-product/${result.data.guid}`)
        //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
    }
    else{
        res.render('vendor/error');
    }
}
*/