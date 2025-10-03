
const HomeService = require('../services/home.service')
const AccountService = require('../services/account.service')

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

/*
exports.dashboard = async function(req, res, next){
    console.log('193: START homer.controller.dashboard')
    
    
            let result = await HomeService.index(req.session)
            if(result.statusCode == 200){
                res.render('home/dashboard', result.data)
            }
            else{
                res.render('/error');
            }
            
            
            
    }
*/
exports.get_login = async function(req, res, next){
        console.log('193: START exports.get_login')


        let result = await AccountService.get_login(req.session)
       // console.log(`146: account.controller get_login result = ${JSON.stringify(result,null,4)}`)
        if(result.statusCode == 200){
            //res.render('home/index', result.data)
            res.render('account/login', result.data);
        }
        else{
            res.render('/error');
        }
        
        
        
}
  
/*
exports.get_verify_email = async function(req, res, next){
    console.log('193: START exports.get_verify_email')


    let result = await AccountService.get_verify_email(req.session)
   // console.log(`146: account.controller get_login result = ${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        //res.render('home/index', result.data)
        res.render('account/verifiy-email', result.data);
    }
    else{
        res.render('/error');
    }
    
    
    
}
*/

exports.post_register = async function(req, res, next){

    console.log('60: START account.controller.post_register')

    let result = await AccountService.post_register(req)
    console.log(`63: account.controller.post_register result=${JSON.stringify(result,null,4)}`)
    if(result.statusCode == 200){
        /*
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        
        res.redirect(return_url)
        */
        let data = {
            input:{
                code:'',
                email:req.body['email'],
                username:req.body['username']
                }
            
        }
        res.render('myaccount/verify-email',data)

    }
    else{
        
        
        let data = {register:req.body,error:result.error}
        console.log(`81: ${result.statusCode} account.controller.post_register data = ${JSON.stringify(data,null,4)}`)

        res.render('account/register',data)
    }
    
        
}

exports.post_login = async function(req, res, next){

    console.log('193: START account.controller.post_login')

    let result = await AccountService.post_login(req)

    console.log(`193: account.controller.post_login result = ${JSON.stringify(result,null,4)}`)

    if(result.statusCode == 200){
        
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        
        res.redirect(return_url)
    }
    else{
        let data = {login:{username:req.body.username,password:req.body.password,error:result.error}}
        console.log(`193: ${result.statusCode} account.controller.post_login data = ${JSON.stringify(data,null,4)}`)
        res.render('account/login',data)
    }
    
        
}


exports.post_verify_email = async function(req, res, next){

    console.log('193: START account.controller.post_login')

    let result = await AccountService.post_verify_email(req)

    console.log(`193: account.controller.post_login result = ${JSON.stringify(result,null,4)}`)

    if(result.statusCode == 200){
        
        /*let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        */
        
        res.redirect('/')
    }
    else{
        let data = {input:req.body,error:result.error}
        console.log(`193: ${result.statusCode} account.controller.post_verify_email data = ${JSON.stringify(data,null,4)}`)
        res.render('account/verify-email',data)
    }
    
        
}
/*
exports.post_verify_email = async function(req, res, next){

    console.log('193: START account.controller.post_login')

    let result = await AccountService.post_verify_email(req)

    console.log(`193: account.controller.post_login result = ${JSON.stringify(result,null,4)}`)

    if(result.statusCode == 200){
        
       
        
        res.redirect('/')
    }
    else{
        let data = {input:req.body,error:result.error}
        console.log(`193: ${result.statusCode} account.controller.post_verify_email data = ${JSON.stringify(data,null,4)}`)
        res.render('account/verify-email',data)
    }
    
        
}
    
exports.post_addwallet = async function(req, res, next){

    console.log('193: START account.controller.post_login')

    let result = await AccountService.post_login(req)
    if(result.statusCode == 200){
        
        let return_url = req.session['return_url']

        if(return_url == null || return_url == '' ){
            return_url = '/'
        }
        
        res.redirect('/home/dashboard')
    }
    else{
        res.redirect('/error')
    }
    
        
}
*/