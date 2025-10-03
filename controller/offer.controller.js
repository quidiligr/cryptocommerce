const OfferService = require('../services/offer.service')





exports.submit = async function(req, res, next){
    console.log('32: START offer.controller.success')
    
    
            let result = await OfferService.submit(req.session, req.body)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`38: calling view offer/success, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('offer/success',result.data)
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
    console.log('37: START offer.controller.tracking')
    
    
            let result = await OfferService.tracking(req.session, req.params)
            //res.locals.user = req.session.user;
            //res.locals.cart = req.session.cart;
            
        
            if(result.statusCode == 200){
                //res.status(result.statusCode).json(result.data)
                console.log(`73: calling view offer/tracking, ${JSON.stringify(result.data,null,4)}`)
                
                res.render('offer/tracking',result.data)
                //res.render('vendor/product-list', {products: result.data.products, currentUrl:'products'});
            }
            else{
                res.render('/error');
            }
            
            
            
    }
    


