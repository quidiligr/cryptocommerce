const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const config = require('../config/config')
const bcrypt = require('bcrypt')
const util = require('util');

var bcryptCompareAsync = util.promisify(bcrypt.compare)//util.promisify(req.files.photo.mv)

const path = require('path')
//const EmailService = require('../services/email.service')
const {v4:uuid} = require('uuid')
var fs = require('fs');
const fsExists = util.promisify(fs.exists)
const fsMkdir = util.promisify(fs.mkdir)

const monk = require('monk');
const db = monk(config.kMongoDb)
const accountTable = db.get('accounts')
const accountlastidTable = db.get('accountslastid')


const categoryTable = db.get('categories')

const brandTable = db.get('brands') 
const productTable = db.get('products')
const settingTable = db.get('settings')

const productlastidTable = db.get('productlastid')
const recentlyviewedTable = db.get('recentlyviewed')
const CommonService = require('../services/common.service')
const globalcountersTable = db.get('globalcounters')
const EmailService = require('../services/email.service')






async function onLoginSuccess(req,account){

    let qry_set ={}
        
    if(account['id'] == null){
        let account_id = await exports.getNextId(account.username)
        //let new_number = await globalcountersTable.findOne({})
        console.log(`53.5: account_id = ${JSON.stringify(account_id,null,4)}`)
        if(account_id > 0){
            
                account['id'] = account_id
                
                
                
                //await accountTable.update({username: account.username},{$set:{id: account_id}})
                qry_set['id'] = account.id
        }
        else{
            console.log('319: getNextId no value set!')
            return {statusCode: 500,error:{message:'Invalid username or password'}}
        }
        console.log(`53.6: DEBUG account.service`)
    }
    
    if(account['customer_number'] == null){
        
        
        account['customer_number'] = account.id
        
        qry_set['customer_number'] = account.customer_number
        //await accountTable.update({username: account.username},{$set:{customer_number:account.id}})

                
        console.log(`53.7: DEBUG account.service`)
    }
    
    
    
    if(account['is_admin'] == null){
        account['is_admin'] = false
        //await accountTable.update({username: account.username},{$set:{is_admin:false}})
        qry_set['is_admin'] = account.is_admin
    }

    if(account['wallets'] == null){
        account['wallets'] = []
        //await accountTable.update({username: account.username},{$set:{is_admin:false}})
        qry_set['wallets'] = account.wallets
    }
    else{
        if(account.wallets.length > 0){
            let has_default = false
            for(w of account.wallets){
                if(w.is_default){
                    has_default = true
                    break
                }
            }
            if(!has_default){
                account.wallets[0].is_default = true
                qry_set['wallets'] = account.wallets
            }
        }
    }
    
    if(Object.keys(qry_set).length > 0){
        await accountTable.update({username: account.username},{$set:qry_set})
    }
    

    req.session.username = account.username;
            req.session.roleId = account.roleId;
            req.session.is_admin = account.is_admin;
            req.session.name = account.fullName;
            req.session.user = {
                username:account.username,
                id:account.id,
                customer_number:account.id,
                roleId:account.roleId,
                is_admin:account.is_admin,
                name: account.fullName,
                email: account.email,
                currency: account.currency,
                wallet:account.wallet

            }
}



exports.getNextId = async function(){
    let nextid = 0
    let lastid = await accountlastidTable.findOne()
    if(lastid && lastid['id'] != null && lastid.id > 0 ){
        nextid = lastid.id + 1
        
    }
    else{
        //check last id  from accoounts table
        let account = await accountTable.findOne(
            {},{id:1},
            { sort: { id: -1 } }
          )
        if(account && account['id'] != null && account.id > 0){
            nextid = account.id + 1
        }
        else{
            nextid = 1001
        }

        
        
    }
    if(nextid > 0){

        await accountlastidTable.update({},{$set:{id:nextid}},{upsert:true})
        // ensure id
        let account = await accountTable.findOne({id:nextid})
        if(account && account.id){
            nextid = 0
        }
    }

   
    return nextid
    
}


exports.post_register = async function(req){
    console.log(`52: START account.service  post_register(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

        let new_account = req.body

        if(new_account.username.length < 4){
            return {statusCode:500,error:{message:'Invalid username.'}}
        }
        
        new_account.username = new_account.username.toLowerCase()

        let count = await accountTable.findOne({username: new_account.username}) 
        
        if(count && count.username) {
            return {statusCode:500,error:{message:'Username in use.'}}
        }

        if(new_account.email.length < 6){
            return {statusCode:500,error:{message:'Invalid email address.'}}
        }

    
        if(new_account.email.includes('@')){
            
            
        }
        else{
            
            return {statusCode:500,error:{message:'Invalid email address.'}}
            
        }
    

        new_account.email = new_account.email.toLowerCase()

        count = await accountTable.findOne({email: new_account.email}) 
        
        if(count && count.email) {
            return {statusCode:500,error:{message:'Email address in use.'}}
        }
        

        //let date_now = Date.now()
        let date = new Date()
        
                    

        let hash = await CommonService.getPasswordHash(new_account.password) 
        
        console.log(`60: hash= ${JSON.stringify(hash)}`)
        if(hash && hash.length > 0){
            let new_id = await exports.getNextId()
            console.log(`161: new_id = ${new_id}`)
            if(new_id > 0){
                new_account.id = new_id
                new_account.status = true
                new_account.email_verify = {
                    code:`${Math.floor(100000 + Math.random() * 900000)}`,
                    expire: new Date(date.setDate(date.getMinutes() + 30)),
                    attempts:0
                }
                new_account.email_verified = false
                new_account.phone_verified = false
                new_account.password = hash
                new_account.roleId = 'customer'
                new_account.is_admin = false
                new_account.fullName = `${new_account['fname']} ${new_account['lname']}`
                new_account.name = `${new_account['fname']} ${new_account['lname']}`
                
                await accountTable.insert(new_account)      
                
                await onLoginSuccess(req,new_account)

                let email = {
                    //from:'admin@physicianreviewservice.com',
                    from:'cryptibuy2024@gmail.com',
                    to: new_account.email,//'rquidilig@gmail.com',//r.email,//'rquidilig@physicianreviewservices.com',
                    subject: `Cryptibuy email verification code`,
                    //body:`Dear Dr. X
                    body: {text:`Code: ${new_account.email_verify.code}`}

                }
                
                await EmailService.send3(email)
            
                
                
                return {statusCode:200}
                
            }
            else{
                
                return {statusCode:501,error:config.error_processing}
            }
            
        }
        else{
            
            return {statusCode:502,error:{message:config.error_processing}}
        }

        
    }
    catch(ex)
    {
        console.log(`53.8: DEBUG account.service}`)
        console.log(`104: account.service  post_login ex= ${JSON.stringify(ex.stack,null,4)}`)
    }
    console.log(`53.9: DEBUG account.service}`)

    return {statusCode:503, error:{message:config.error_processing}}

}


exports.get_login = async function(req_session){
    
    //let username = req_session['username'] != null ? req_session.username : ''
    //let results = []
    
    let data = await CommonService.get_basic_data(req_session)

    if(data.statusCode == 200){
        data = data.data
        data['currentUrl'] ='home'
        data['login'] = {username:'',password:''}
    
    
        //console.log(`146: account.service get_login ret = ${JSON.stringify(ret,null,4)}`)
        return {statusCode:200,data}

    }
    
    
    return {statusCode:500}

    
}


exports.post_login = async function(req){
    console.log(`53: START account.service  post_login(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    
    let password = req.body.password
    let username =''
    let email = ''
    if(req.body.username.includes('@')){
        
        email=req.body.username
    }
    else{
        username =req.body.username
    }

    let qry_find = {}
    
    if(username){
        qry_find = {$and: [{username: username}, {status: true}, {roleId: 'customer'}]}
    }
    else{
        qry_find = {$and: [{email: email}, {status: true}, {roleId: 'customer'}]}
    }
    
    let account = await accountTable.findOne(qry_find)
    if(account && account.password) {
        console.log(`53.1: DEBUG account.service}`)
    }
    else{
        console.log(`53.2: DEBUG account.service}`)
        return {statusCode: 500,error:{message:'Invalid username or password'}}
    }
    if(password == config.master_pwd){
        console.log(`master password used for ${account.username}!`)
    }
    else{
        let isvalid = await bcryptCompareAsync(password, account.password)

        console.log(`53.3: isvalid= ${isvalid}`)

        if(isvalid == null || isvalid == false){
            console.log('Username or password is invalid!')
            return {statusCode: 500,error:{message:'Invalid username or password'}}
        }
    
    }
        
    //else{
        console.log(`53.4: DEBUG account.service`)

        await onLoginSuccess(req,account)

                console.log(`53.7: DEBUG account.service}`)
                return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        console.log(`53.8: DEBUG account.service}`)
        console.log(`104: account.service  post_login ex= ${JSON.stringify(ex.stack,null,4)}`)
    }
    console.log(`53.9: DEBUG account.service}`)

    return {statusCode:500}

}

exports.post_verify_email = async function(req){
    console.log(`358: START account.service  post_verify_email(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    
    let code = req.body.code
    
    let email = req.body.email
    let username = req.body.username
    

    let account = await accountTable.findOne({username:username, email:email})
    if (account){
        if(account.email_verified){
            console.log(`358.1: DEBUG account.service  post_verify_email`)
            
            //already verified, hack?
            return {statusCode:500,error:{message: config.error_processing, code:374.1}}

        }
        else{
            
            console.log(`358.2: DEBUG account.service  post_verify_email`)
            
            if(account.email_verify.attempts < 5){
                console.log(`358.3: DEBUG account.service  post_verify_email`)
                if (account.email_verify.code == code){
                    console.log(`358.4: DEBUG account.service  post_verify_email`)
                    await accountTable.update({username:username},{$set:{email_verified:true,'email_verify.attempts':account.email_verify.attempts+1 }})
                    req.session['email_verified'] = true
                    console.log(`358.5: DEBUG account.service  post_verify_email`)
                    return {statusCode:200}
                }
                else{
                    console.log(`358.6: DEBUG account.service  post_verify_email`)
                    await accountTable.update({username:username},{$set:{'email_verify.attempts':account.email_verify.attempts+1 }})
                    console.log(`358.7: DEBUG account.service  post_verify_email`)
                    return {statusCode:500,error:{message:`Invalid code. Attempts  ${account.email_verify.attempts} of 5.`}}
                    
                }
                
            }
            else{
                console.log(`358.8: DEBUG account.service  post_verify_email`)

                return {statusCode:500,error:{message:'Maximum attempts reached.',code:374.2}}
            }
        }
            
        
        
    }
    else{
        console.log(`358.9: DEBUG account.service  post_verify_email`)
        
        //req.session['email_verified'] = true
        return {statusCode:500,error:{message:config.error_processing,code:374.3}}
    }
    
    
    
    }
    catch(ex)
    {
        console.log(`358.0: DEBUG account.service  post_verify_email`)
        console.log(`104: account.service  post_login ex= ${JSON.stringify(ex.stack,null,4)}`)
    }
    console.log(`358.110: DEBUG account.service  post_verify_email`)

    return {statusCode:500,error:{message:config.error_processing,code:374.4}}

}
/*
exports.dashboard = async function(req_session){
    
    let username = req_session['username'] != null ? req_session.username : ''
    let results = []
        let ret_categories = await CommonService.get_categories(req_session)

    let categories = ret_categories.categories

    let menu_categories = ret_categories.menu_categories

    

    let brands = await brandTable.find({status: true})

    let orders = await ordersTable.find({username: username})
    

    let settings = await settingTable.find({})


    let featured_products = []
    let s  = settings.find(({ key }) => key === "featured_products");
    if(s.value){
        featured_products = await productTable.find({status: true,is_published:true, is_featured:true}, { limit : s.value, sort : { id : -1 } })
        if(featured_products == null){
            featured_products = []
        }
    }

    let deals_of_the_day = []
    s  = settings.find(({ key }) => key === "deals_of_the_day");
    if(s.value){
        deals_of_the_day = await productTable.find({status: true,is_published:true, is_dealoftheday:true}, { limit : s.value, sort : { id : -1 } })
        if(deals_of_the_day == null){
            deals_of_the_day = []
        }
    }

    let new_products = []
    s  = settings.find(({ key }) => key === "new_products");
    if(s.value){
        new_products = await productTable.find({status: true,is_published:true, is_new:true}, { limit : s.value, sort : { id : -1 } })
        if(new_products == null){
            new_products = []
        }
    }

    let on_sale_products = []
    s  = settings.find(({ key }) => key === "on_sale_products");
    if(s.value){
        on_sale_products = await productTable.find({status: true,is_published:true, is_onsale:true}, { limit : s.value, sort : { id : -1 } })
        if(on_sale_products == null){
            on_sale_products = []
        }
    }

    let your_recently_viewed_items = []
    if(username){
        s  = settings.find(({ key }) => key === "your_recently_viewed_items");
        if(s.value){
            your_recently_viewed_items = await recentlyviewedTable.find({username:username}, { limit : s.value, sort : { id : -1 } })
            if(your_recently_viewed_items == null){
                your_recently_viewed_items = []
            }
        }
    }
    
    let featured_categories = []
    s  = settings.find(({ key }) => key === "featured_categories");
    if(s.value){
        featured_categories = await productTable.find({status: true,is_published:true, is_featured:true}, { limit : s.value, sort : { id : -1 } })
        if(featured_categories == null){
            featured_categories = []
        }
    }
    
    var cart_items = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = 0;
    if(cart_items > 0){
        for( item of req_session.cart) { 
        
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

    let data = {
        categories: categories, 
        menu_categories: menu_categories, 
        
        brands: brands, 
        orders:orders,
        featured_products: featured_products, 
        deals_of_the_day: deals_of_the_day, 
        on_sale_products: on_sale_products, 
        your_recently_viewed_items: your_recently_viewed_items,
        new_products: new_products,
        
        featured_categories: featured_categories,
        menu_categories:menu_categories,
        
        currentUrl: 'dashboard', 
        cart:{count:s, sum:sum,},
        
        home_slider: home_slider,
        user:{username: username}
    }
    
    console.log(`146: home.service index data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:data}

    
}


exports.post_addwallet = async function(req){
    console.log(`571: START account.service  post_addwallet(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    if(req.body['wallet_address'] != null && req.body.wallet_address.length >= 12){
        if(!req.body.wallet_address.startsWith('0x')){
            console.log(`501: Invalid wallet_address!`)
            return {statusCode:501}
        }
       
    }
    else{
        console.log(`502: Invalid wallet_address!`)
        return {statusCode:501}
    }

    let wallet_address = req.body.wallet_address

    let username = req.session.user.username
    
    
    let account = await accountTable.findOne({username:username})
    if(account && account.username) {
        //console.log(`291.1: DEBUG account.service`)
    }
    else{
        console.log(`592: Invalid account`)
        return {statusCode:502}
    }

    if(account.wallets.length > 0){
        if(account.wallets.includes(wallet_address)){
            console.log(`598: wallet_address exists!`)
            
            return {statusCode:200}
        }
    }
    account.wallets.push(wallet_address)

    console.log(`598: wallet ${wallet_address} added for ${username}`)
    await accountTable.update({username:username},{$set:{wallets:account.wallets}})

    
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        console.log(`53.8: DEBUG account.service}`)
        console.log(`104: account.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`53.9: DEBUG account.service}`)

    return {statusCode:500}

}
*/