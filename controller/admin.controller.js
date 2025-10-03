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
        res.render('admin/dashboard', data);
    });
    */


//const DashboardService = require('../services/vendor/dashboard.service')

//const ProductService = require('../services/vendor/vendor.service')

const AdminService = require('../services/admin.service')

exports.dashboard = async function(req, res, next){


 
    /*
    router.get('/', function(req, res, next) { 
    var db = req.db;
    var productTable = db.get('products'); 
    var brandTable = db.get('brands'); 
    productTable.find({}, {}, function(error, result){
        //res.render('admin/product/index', {products: result, currentUrl:'product'});
        res.render('admin/product-list', {products: result, currentUrl:'product'});
    });       
});
    */

    
    console.log('\r\n 53: START vendor.controller exports.dashboard \r\n')
    console.log(`\r\n 54: req.session=${JSON.stringify(req.session,null,4)} \r\n`)
    console.log(`\r\n 55: req.body=${JSON.stringify(req.body,null,4)} \r\n`)
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
 
    try{

 
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await AdminService.dashboard(req.session, req.body)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            //res.render('admin/product-list', {products: result.data.products, currentUrl:'products'});
            res.render('admin/dashboard', result.data);
        }
        else{
            res.render('admin/error');
        }
        
        
    
    }catch(err){

        console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
        //throw Error(e)
        //res.status(500).json({error:config.kERROR_100})
        res.render('admin/error');
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
        res.render('admin/product-list', {products: result, currentUrl:'product'});
    });       
});
    */
    
    console.log('\r\n 101: --------------------- admin.controller.js products START ---------------------\r\n')
    console.log(`102: req.session= ${JSON.stringify(req.session,null,4)}`)    
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
 
        try{

 
        //let result = await APIService.messenger(req.params.apiKey, req.body)


        let result = await AdminService.product_list(req.session,req.body)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.render('admin/product-list', result.data);
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
        res.render('admin/add-product', data);
    });
    */
    //console.log('\r\n --------------------- product.controller.js index START ---------------------\r\n')
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
 
        //try{

 
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await AdminService.add_product(req.session,req.body)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.redirect(`/vendor/edit-product/${result.data.guid}`)
            //res.render('admin/product-list', {products: result.data.products, currentUrl:'products'});
        }
        else{
            res.render('admin/error');
        }
        
        
    
    //}catch(err){

    //    console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
        //throw Error(e)
        //res.status(500).json({error:config.kERROR_100})
        //res.render('admin/error');
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
            res.render('admin/add-product', data);
        });
        */
        //console.log('\r\n --------------------- product.controller.js index START ---------------------\r\n')
            
        //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
            
     
            //try{
    
     
            //let result = await APIService.messenger(req.params.apiKey, req.body)
            let result = await AdminService.remove_product(req.session,req.params)
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`234: calling render vendor/remove_product, ${JSON.stringify(result.data,null,4)}`)
                //res.render('admin/edit-product',result.data)
                //res.render('admin/product-list', {products: result.data.products, currentUrl:'products'});
                res.redirect('/vendor/product-list')
            }
            else{
                res.render('admin/error');
            }
            
            
        
        //}catch(err){
    
        //    console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
            //throw Error(e)
            //res.status(500).json({error:config.kERROR_100})
            //res.render('admin/error');
        //}
    }
    

exports.edit_product = async function(req, res, next){
    console.log('193: START vendor.controller.edit_product')
  
    
            let result = await AdminService.edit_product(req.session,req.params)
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`234: calling render vendor/edit_product, ${JSON.stringify(result.data,null,4)}`)
                res.render('admin/edit-product',result.data)
                //res.render('admin/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('admin/error');
            }
            
            
            
    }

exports.product_detail = async function(req, res, next){
    console.log('193: START vendor.controller.product_detail')
    
        
          
    let result = await AdminService.product_detail(req.session,req.params)
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`234: calling render vendor/product_detail, ${JSON.stringify(result.data,null,4)}`)
                res.render('admin/product-detail',result.data)
                //res.render('admin/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('admin/error');
            }
            
            
            
    }
exports.save_product = async function(req, res, next){
    console.log('254: START vendor.controller.save_product')
    console.log(`255: ${JSON.stringify(req.body,null,4)}`)
    
    let result = await AdminService.save_product(req)
    if(result.statusCode == 200){
        //res.status(result.statusCode).json(result.data)
        res.redirect(`/vendor/edit-product/${result.data.guid}`)
        //res.render('admin/product-list', {products: result.data.products, currentUrl:'products'});
    }
    else{
        res.render('admin/error');
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
        res.render('admin/product-list', {products: result, currentUrl:'product'});
    });       
});
    */
    
    console.log('\r\n 101: --------------------- vendor.controller.js order_list START ---------------------\r\n')
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
    
        try{

    
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await AdminService.order_list(req.session,req.body)
        console.log(`vendor.controller order_list result= ${JSON.stringify(result,null,4)}`)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.render('admin/order-list', result.data);
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
        res.render('admin/product-list', {products: result, currentUrl:'product'});
    });       
});
    */
    
    console.log('\r\n 101: --------------------- vendor.controller.js offer_list START ---------------------\r\n')
        
    //console.log(`\r\n req.body=   ${JSON.stringify(req.body)} \r\n`)
        
    
        try{

    
        //let result = await APIService.messenger(req.params.apiKey, req.body)
        let result = await AdminService.offer_list(req.session,req.body)
        console.log(`vendor.controller offer_list result= ${JSON.stringify(result,null,4)}`)
        if(result.statusCode == 200){
            //res.status(result.statusCode).json(result.data)
            res.render('admin/offer-list', result.data);
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
    let result = await AdminService.save_product(req)
    if(result.statusCode == 200){
        //res.status(result.statusCode).json(result.data)
        res.redirect(`/vendor/edit-product/${result.data.guid}`)
        //res.render('admin/product-list', {products: result.data.products, currentUrl:'products'});
    }
    else{
        res.render('admin/error');
    }
}
*/