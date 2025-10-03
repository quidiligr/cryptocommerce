
const APIService = require('../services/api.service')
const VendorService = require('../services/vendor.service')
const RenderService = require('../services/render.service')

exports.cart_add = async function(req, res, next){
    console.log('37: START api.controller.product_page')
  
    
            let result = await APIService.cart_add(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }

exports.cart_removeitem = async function(req, res, next){
    console.log('37: START api.controller.cart_removeitem')
    
    
            let result = await APIService.cart_removeitem(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }
    
exports.order_place = async function(req, res, next){
    console.log('37: START api.controller.cart_removeitem')
    
    
            let result = await APIService.cart_removeitem(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }

exports.quickview = async function(req, res, next){
    console.log('37: START api.controller.quickview')
    
    
            let result = await APIService.quickview(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }
    
        
exports.makeoffer = async function(req, res, next){
    console.log('37: START api.controller.makeoffer')
    
    
            let result = await APIService.makeoffer(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }

exports.getMyWallets = async function(req, res, next){
    console.log('37: START api.controller.getMyWallets')
    
    
            let result = await APIService.getMyWallets(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }
    
exports.mywallet_remove = async function(req, res, next){
    console.log('37: START api.controller.mywallet_remove')
    
    
            let result = await APIService.mywallet_remove(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }

exports.mywallet_edit = async function(req, res, next){
    console.log('37: START api.controller.mywallet_edit')
    
    
            let result = await APIService.mywallet_edit(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
    }
    

exports.getMyOrders = async function(req, res, next){
    console.log('37: START api.controller.getMyOrders')
    
    
            let result = await APIService.getMyOrders(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}

exports.getMyProducts = async function(req, res, next){
    console.log('318: START api.controller.getMyProducts')
    
    
            let result = await APIService.getMyProducts(req.session,req.body)
            
            
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}


exports.getSaleOrders = async function(req, res, next){
    console.log('37: START api.controller.getMyOrdersSales')
    
    
            let result = await APIService.getSaleOrders(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}
    
exports.getMyOffers = async function(req, res, next){
    console.log('37: START api.controller.getMyOffers')
    
    
            let result = await APIService.getMyOffers(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}

exports.getPayouts = async function(req, res, next){
    console.log('37: START api.controller.getMyOrdersSales')
    
    
            let result = await APIService.getPayouts(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}


exports.getMyInfo = async function(req, res, next){
    console.log('349: START api.controller.getMyInfo')
    
    
            let result = await APIService.getMyInfo(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}

exports.getMyBusinessProfile = async function(req, res, next){
    console.log('37: START api.controller.getMyBusinessProfile')
    
    
            let result = await APIService.getMyBusinessProfile(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}

exports.getMySettings = async function(req, res, next){
    console.log('37: START api.controller.getMySecurity')
    
    
            let result = await APIService.getMySecurity(req.session,req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        /*
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`43: calling render product/product/product-page-no-sidebar, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('product/product-page-no-sidebar',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            */
            
            if(result.statusCode == 200){
                res.status(result.statusCode).json(result.data)
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
}

exports.addProduct = async function(req, res, next){
    console.log('373: START api.controller.addProduct')
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
            let result1 = await VendorService.add_product(req.session,req.body)
            console.log(`546: exports.addProduct() result= ${JSON.stringify(result1,null,4)}`)
            if(result1.statusCode == 200){

                //let html = RenderService.editProduct(result.data)
                let result2 = await APIService.editProduct(req.session,result1.data)
                if(result2.statusCode == 200){

                    let html = await RenderService.editProduct(result2.data)
                    console.log(`580: html = ${html}`)


                    
                    res.status(result2.statusCode).json({html:html})
                }
                else{
                    res.status(result2.statusCode).json(result2.error)
                }


                
                //res.status(result2.statusCode).json({data:{html:html}})
            }
            else{
                res.status(result1.statusCode).json(result1.error)
            }
            
            
        
        //}catch(err){
    
        //    console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
            //throw Error(e)
            //res.status(500).json({error:config.kERROR_100})
            //res.render('vendor/error');
        //}
}
    
exports.getEditProduct = async function(req, res, next){
    console.log('538: START api.controller.getEditProduct')
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
            //let req.body
     
            //let result = await APIService.messenger(req.params.apiKey, req.body)
            if(req.body == null || req.body["id"] == null){
    
       
                console.log(`2011: Product id is missing!`)
                return {statusCode:500}
                
                
            } 
            
        
            //let id = req_body.id
        
            let result = await APIService.editProduct(req.session,req_body.id)
            if(result.statusCode == 200){

                let html = await RenderService.editProduct(result.data)
                console.log(`580: html = ${html}`)


                
                res.status(result.statusCode).json({html:html})
            }
            else{
                res.status(result.statusCode).json(result.error)
            }
            
            
        
        //}catch(err){
    
        //    console.log('!!!!! 50: product.controller index ERROR: ' + JSON.stringify(err.stack));
            //throw Error(e)
            //res.status(500).json({error:config.kERROR_100})
            //res.render('vendor/error');
        //}
}

exports.removeProduct = async function(req, res, next){
    console.log('538: START api.controller.removeProduct')
   
    
            if(req.body == null || req.body["id"] == null){
    
       
                console.log(`2011: Product id is missing!`)
                return {statusCode:500}
                
                
            } 
            
        
            //let id = req_body.id
        
            let result1 = await APIService.removeProduct(req.session,req.body.id)
            if(result1.statusCode == 200){

                let result2 = await APIService.getMyProducts(req.session,req.body)
            
                if(result2.statusCode == 200){
                    res.status(result2.statusCode).json(result2.data)
                }
                else{
                    res.status(result2.statusCode).json(result2.error)
                }
                
                
            }
            else{
                res.status(result1.statusCode).json(result1.error)
            }
            
            
}
