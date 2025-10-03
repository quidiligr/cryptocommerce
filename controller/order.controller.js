const OrderService = require('../services/order.service')



exports.checkout = async function(req, res, next){
    console.log('6: START order.controller.checkout')
    
    
    
    let result = await OrderService.checkout(req.session)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`38: calling view order/checkout, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('order/checkout',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }


exports.success = async function(req, res, next){
    console.log('32: START order.controller.success')
    
    
            let result = await OrderService.success(req.session, req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`38: calling view order/success, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('order/success',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error',result.data);
            }
            
            
            
    }
    
exports.failed = async function(req, res, next){
    
                res.render('/error');
    
                
    }
    
exports.tracking = async function(req, res, next){
    console.log('37: START order.controller.tracking')
    
    
            let result = await OrderService.tracking(req.session, req.params)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`73: calling view order/tracking, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('order/tracking',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }
    


