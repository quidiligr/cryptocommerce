const CartService = require('../services/cart.service')

exports.index = async function(req, res, next){
    console.log('37: START cart.controller.index')
  
    
            let result = await CartService.index(req.session)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
                
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`14: calling view cart/index, ${JSON.stringify(result.data,null,4)}`)
                res.render('cart/index',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }


exports.success = async function(req, res, next){
    console.log('37: START cart.controller.success')
    
    
            let result = await CartService.checkout(req.session)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`38: calling view cart/checkout, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('cart/checkout',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }

exports.checkout = async function(req, res, next){
    console.log('37: START cart.controller.checkout')
    
    
    
    let result = await CartService.checkout(req.session)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`38: calling view cart/checkout, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('cart/checkout',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }

/*
exports.checkout_success = async function(req, res, next){
    console.log('37: START cart.controller.checkout_success')
    
    
            let result = await CartService.checkout_success(req.session)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`38: calling view cart/checkout, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('order/order-success',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }
    */
    
    
