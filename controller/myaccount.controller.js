
const HomeService = require('../services/home.service')
const AccountService = require('../services/account.service')
const MyAccountService = require('../services/myaccount.service')
/*
exports.index = async function(req, res, next){
    console.log('193: START vendor.controller.product_page')
  
    
            let result = await HomeService.index(req.session)
            if(result.statusCode == 200){
                res.render('home/index', result.data)
            }
            else{
                res.render('/error');
            }
            
            
            
    }
    */


    exports.dashboard = async function(req, res, next){
        console.log('193: START homer.controller.dashboard')
    
        if(req.session['user'] == null || req.session.user['username'] == null 
        || req.session.user.username == '' || req.session.user.username == 'guest'){
            res.redirect('/');
        }
        else{
        
        
                let result = await MyAccountService.dashboard(req)
                if(result.statusCode == 200){
                    res.render('myaccount/dashboard', result.data)
                }
                else{
                    res.render('/error');
                }
                
            }   
                
        }
        

    
exports.post_addwallet = async function(req, res, next){

    console.log('193: START account.controller.post_login')

    let result = await MyAccountService.post_addwallet(req)
    if(result.statusCode == 200){
        
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        
        res.redirect('/myaccount/dashboard/wallets')
    }
    else{
        res.render('wallet/add-wallet',{input:{address:req.body.wallet_address, is_default:req.body.is_default}})
    }
    
        
}


exports.get_editwallet = async function(req, res, next){

    console.log('193: START myaccount.controller.get_editwallet')

    let result = await MyAccountService.get_editwallet(req)
    console.log(`193: myaccount.controller.get_editwallet result=${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        /*
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        */
       let data = result.data
        
        res.render('myaccount/edit-wallet',{input:{id:data.id, address:data.address, is_default:data.is_default}})
    }
    else{
        res.render('/error')
        
    }
    
        
}


exports.post_editwallet = async function(req, res, next){

    console.log('193: START account.controller.post_editwallet')

    let result = await MyAccountService.post_editwallet(req)
    if(result.statusCode == 200){
        
        
        
        res.redirect('/myaccount/dashboard/wallets')
    }
    else{
        res.render('myaccount/edit-wallet',{input:{address:req.body.wallet_address, is_default:req.body.is_default}})
    }
    
        
}


exports.removeWallet = async function(req, res, next){

    console.log('193: START myaccount.controller.removeWallet')

    let result = await MyAccountService.removeWallet(req)
    console.log(`193: myaccount.controller.removeWallet result=${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        /*
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        */
       //let data = result.data
        
        res.redirect('/myaccount/dashboard/wallets')
    }
    else{
        res.render('/error')
        
    }
    
        
}

exports.getAddProduct = async function(req, res, next){

    console.log('193: START myaccount.controller.get_editwallet')

    let result = await MyAccountService.get_editwallet(req)
    console.log(`193: myaccount.controller.get_editwallet result=${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        /*
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        */
       let data = result.data
        
        res.render('myaccount/edit-wallet',{input:{id:data.id, address:data.address, is_default:data.is_default}})
    }
    else{
        res.render('/error')
        
    }
    
        
}


exports.postAddProduct = async function(req, res, next){

    console.log('193: START account.controller.postAddProduct')

    let result = await MyAccountService.post_editwallet(req)
    if(result.statusCode == 200){
        
        
        
        res.redirect('/myaccount/dashboard/wallets')
    }
    else{
        res.render('myaccount/edit-wallet',{input:{address:req.body.wallet_address, is_default:req.body.is_default}})
    }
    
        
}


exports.getChangepassword = async function(req, res, next){

    console.log('193: START myaccount.controller.getChangepassword')

    //let result = await MyAccountService.getChangePassword(req)
    //console.log(`193: myaccount.controller.get_changepassword result=${JSON.stringify(result,null,4)}`)
    
    //let data = result.data
        
        res.render('myaccount/change-password',{input:{new_password:''}})
    
        
        
}

exports.postChangepassword = async function(req, res, next){

    console.log('193: START account.controller.postChangepassword')

    let result = await MyAccountService.postChangePassword(req)
    if(result.statusCode == 200){
        
        
        
        res.redirect('/myaccount/dashboard/info')
    }
    else{
        res.render('myaccount/change-password',{input:{new_password:req.body.new_password}})
    }
    
        
}

exports.getEditBillingAddress = async function(req, res, next){

    console.log('193: START myaccount.controller.getEditBillingAddress')

    let result = await MyAccountService.getEditBillingAddress(req)
    console.log(`193: myaccount.controller.getEditBillingAddress result=${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        /*
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        */
       //let data = result.data
        
        res.render('myaccount/edit-billing-address',{input:result.data})
    }
    else{
        res.render('/error')
        
    }
    
        
}

exports.postEditBillingAddress = async function(req, res, next){

    console.log('193: START account.controller.postEditBillingAddress')

    let result = await MyAccountService.postEditBillingAddress(req)
    if(result.statusCode == 200){
        
        
        
        res.redirect('/myaccount/dashboard/info')
    }
    else{
        res.render('myaccount/edit-billing-address',{input:{address:req.body.address}})
    }
    
        
}

exports.getEditShippingAddress = async function(req, res, next){

    console.log('193: START myaccount.controller.getEditShippingAddress')

    let result = await MyAccountService.getEditShippingAddress(req)
    console.log(`193: myaccount.controller.getEditShippingAddress result=${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        /*
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        */
      
       
        
        res.render('myaccount/edit-shipping-address',{input:result.data})
    }
    else{
        res.render('/error')
        
    }
    
        
}

exports.postEditShippingAddress = async function(req, res, next){

    console.log('193: START account.controller.postEditShippingAddress')

    let result = await MyAccountService.postEditShippingAddress(req)
    if(result.statusCode == 200){
        
        
        
        res.redirect('/myaccount/dashboard/info')
    }
    else{
        res.render('myaccount/edit-shipping-address',{input:{address:req.body.address}})
    }
    
        
}


exports.getEditCompanyInfo = async function(req, res, next){

    console.log('193: START myaccount.controller.getEditCompanyInfo')

    let result = await MyAccountService.getEditCompanyInfo(req)
    console.log(`193: myaccount.controller.getEditCompanyInfo result=${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        /*
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        */
      
       
        
        res.render('myaccount/edit-company-info',{input:result.data})
    }
    else{
        res.render('/error')
        
    }
    
        
}

exports.postEditCompanyInfo = async function(req, res, next){

    console.log('193: START account.controller.postEditCompanyInfo')

    let result = await MyAccountService.postEditCompanyInfo(req)
    if(result.statusCode == 200){
        
        
        
        res.redirect('/myaccount/dashboard/info')
    }
    else{
        res.render('myaccount/edit-shipping-address',{input:{
            name: req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            

            address:req.body.address
        
        }})
    }
    
        
}

