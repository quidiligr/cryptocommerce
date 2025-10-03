const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const config = require('../config/config')
const util = require('util');
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
const AccountService = require('../services/account.service')




const ordersTable = db.get('orders');
const orderdetailsTable = db.get('orderdetails');
const offersTable = db.get('offers')
const walletsTable = db.get('wallets')



/*
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
*/
exports.dashboard = async function(req){

    let req_session = req.session
    let basic_data = await CommonService.get_basic_data(req_session)
    
    if(basic_data.statusCode != 200){
        return {statusCode:500}
    }

    let data = basic_data.data

    //let categories = basic_data.categories //await categoryTable.find({status: true})

    //let menu_categories = basic_data.menu_categories //[]

    //let cart = basic_data.cart

    //let eth = basic_data.eth


    
    let user =  data.user
    let username = user.username

    //if(user.username != 'guest' ){
        let account = await CommonService.getAccount(username)
        /*
        if(account['username']){
            //update userinfo if needed
            let query_set = {}
            if(data.user['name'] == null){
                data.user['name'] = account['fullName'] != null ? account.fullName:''
             query_set['name'] = data.user.name
            }
 
            
            
            if(data.user['userinfo'] == null){
                data.user['userinfo'] = {
                 shipping_address: config.default_shipping_address,
                 billing_address: config.default_billing_address
             }
             query_set['userinfo'] = data.user.userinfo
             
            } 
            if(data.user['phone'] == null){
                data.user['phone'] = ''
             query_set['phone'] = data.user.phone
            }

            data.user['wallets'] = account.wallets

            if(data.user.wallets== null){
                data.user.wallets = []
                query_set['wallets'] = []
            }
 
            console.log(`253: query_set= ${JSON.stringify(query_set,null,4)}`)
            if(Object.keys(query_set).length > 0){
                console.log('253: execute account update')
                 await accountTable.update({username:data.user.username},{$set:query_set})
            }
            else{
                console.log('253: No account update. All good')
                
            }
 
            
        } 
        else{
            return {statusCode:500}
        }
        */
     
        let summary ={total_orders:0,total_pending_orders:0,total_offers:0,total_pending_offers:0}

    let orders = await orderdetailsTable.find({username: username})

    if (orders == null){
        orders = []
    } 


    
    data['myorders'] = orders

    if(orders.length > 0 ){
        summary.total_orders = orders.length
        for(x of orders){
            if(x.status == 0){
                summary.total_pending_orders = summary.total_pending_orders + 1

            }

        }
    }

    let offers = await offersTable.find({customer: username})

    if (offers == null){
        offers = []
    } 

    
    if(offers.length > 0 ){
        summary.total_offers = offers.length
        for(x of offers){
            if(x.status == 0){
                summary.total_pending_offers = summary.total_pending_offers + 1

            }

        }
    }

    data['myoffers'] = offers
    data['summary'] = summary
    data['tab'] = req.params['tab'] != null ? req.params.tab : '' 

    /*
    let data = {
        categories: categories, 
        menu_categories: menu_categories, 
        
        //brands: brands, 
        myorders:orders,
        //featured_products: featured_products, 
        //deals_of_the_day: deals_of_the_day, 
        //on_sale_products: on_sale_products, 
        //your_recently_viewed_items: your_recently_viewed_items,
        //new_products: new_products,
        
        //featured_categories: featured_categories,
        //menu_categories:menu_categories,
        
        currentUrl: 'dashboard', 
        //cart:{count:s, sum:sum,},
        
        //home_slider: home_slider,
        //user:req_session.user, //{username: username}
        //user_info:userinfo
    }
    */
    
    console.log(`146: home.service index data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:data}

    
}


exports.post_addwallet = async function(req){
    console.log(`386.0: START account.service  post_addwallet(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    if(req.body['wallet_address'] != null && req.body.wallet_address.length >= 12){

    }
    else{
        console.log(`386.1: Invalid wallet_address`)
        return {statusCode:501}
    }

    let is_default = req.body['is_default'] != null ? req.body.is_default : false 

    let wallet_address = req.body.wallet_address

    let username = req.session.user.username
    
    
    let account = await CommonService.getAccount(username)
    if(account && account.username) {
        console.log(`386.2: DEBUG account.service}`)
    }
    else{
        console.log(`386.4: Invalid account`)
        return {statusCode:502}
    }

    if(account.wallets == null){
        account.wallets = []
    }
    
    let existing_wallet = null
    if(account.wallets.length > 0){
        console.log(`386.5:`)
        //const result = inventory.find(({ name }) => name === "cherries");
        existing_wallet = account.wallets.find(( {address}) => address === wallet_address )
        
        
        
    }

    if(existing_wallet){
        console.log(`386.6: `)
        existing_wallet.is_default = is_default

    }
    else{
        console.log(`386.7: `)
        //await account.wallets.push({address:wallet_address,is_default:is_default})
        account.wallets.push({id:Date.now(), address:wallet_address,is_default:is_default})
    
    }

    
    await accountTable.update({username:username},{$set:{wallets:account.wallets}})
    console.log(`386.8: wallet ${wallet_address} added to ${username}`)
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`386.10: DEBUG myaccount.service}`)

    return {statusCode:504}

}


exports.get_editwallet = async function(req){
    console.log(`386.0: START account.service  get_editwallet(req.body= ${JSON.stringify(req.params,null,4)}`)
    try{

        if(req.params['id'] == null){
            return {statusCode:500,error:{message:'Invalid id.'}}
        }

        let id = 0
        try{
            id = parseInt(req.params.id)
            console.log('352: ')

        }
        catch(ex){
                console.log(ex.stack)
                return {statusCode:500}
        }

        if(id > 0){
            console.log(`361: id=${id}`)


        }
        else{
            console.log('364: Invalid id.')
            return {statusCode:500}
        }
        

        
        let account = await CommonService.getAccount(req.session.user.username)
    
        if(account['username'] == null ){

            
            return {statusCode:500,error:{message:'377: Invalid account'}}
        }

        let w = await accountTable.aggregate([
            {$match:{username:account.username}},
            {$unwind:'$wallets'},
            {$match:{'wallets.id':id}},
            {$project:{'wallets':1}}
        ])

        console.log(`386: w= ${JSON.stringify(w,null,4)}`)
            
/*
    db.accounts.aggregate([
        {$match:{username:'test2'}},
        {$unwind:'$wallets'},
        {$match:{'wallets.id':1725245620559}},
        {$project:{'wallets':1}}
    ]).pretty()
    */

    if(w.length > 0)
    {
        console.log('393: Invalid id.')
        w = w[0]
        w = {id:id,address:w.wallets.address,is_default:w.wallets.is_default}
    }
    else{
        console.log('397: Invalid id.')
    }
    
    
    
    return {statusCode:200,data:w}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`386.10: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:config.error_processing}}

}


exports.post_editwallet = async function(req){
    console.log(`427.0: START account.service  post_editwallet(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    if(req.body['wallet_address'] != null && req.body.wallet_address.length >= 12){
        console.log(`427.1:`)
    }
    else{
        console.log(`386.1: Invalid wallet_address`)
        return {statusCode:501}
    }


    

    let wallet_address = req.body.wallet_address

    if(req.body['wallet_id'] == null){
        console.log(`427.2:`)
        return {statusCode:500,error:{message:'Invalid id.'}}
    }

    let wallet_id = 0
    try{
        wallet_id = parseInt(req.body.wallet_id)

    }
    catch(ex){
            console.log(ex.stack)
            return {statusCode:500}
    }

    console.log(`427.3:`)
    if(wallet_id > 0){

    }
    else{
        console.log('Invalid id.')
        return {statusCode:500}
    }
    let username = req.session.user.username
    
    
    let account = await CommonService.getAccount(username)
    if(account && account.username) {
        console.log(`386.2: DEBUG account.service}`)
    }
    else{
        console.log(`386.4: Invalid account`)
        return {statusCode:502}
    }

    if(account.wallets == null){
        account.wallets = []
    }
    
    console.log(`427.4:`)

    let existing_wallet = null
    if(account.wallets.length > 0){
        console.log(`386.5:`)
        //const result = inventory.find(({ name }) => name === "cherries");
        existing_wallet = account.wallets.find(( {id}) => id === wallet_id )
        
    }

    

    if(existing_wallet){
        let has_changed = false
        console.log(`427.6: `)
        if(req.body['is_default'] != null){
            if(existing_wallet.is_default !== req.body.is_default    ){
                existing_wallet.is_default =  req.body.is_default    
                has_changed = true
            }
         
        } 
        
        
        if(existing_wallet.address !== wallet_address){
            existing_wallet.address = wallet_address
            has_changed = true
            
        }
        if(has_changed){
            console.log(`427.7: has_changed is true  `)
            await accountTable.update({username:username},{$set:{wallets:account.wallets}})

        }
        
    }
    else{
        console.log(`427.7: existing_wallet is null  `)
        //await account.wallets.push({address:wallet_address,is_default:is_default})
        //account.wallets.push({id:Date.now(), address:wallet_address,is_default:is_default})
        //await accountTable.update({username:username},{$set:{wallets:wallets}})
    
        
    }

    console.log(`427.8: existing_wallet is null  `)
        
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`427.9: DEBUG myaccount.service}`)

    return {statusCode:500}

}


exports.removeWallet = async function(req){
    console.log(`386.0: START account.service  removeWallet(req.body= ${JSON.stringify(req.params,null,4)}`)
    try{

        if(req.params['id'] == null){
            return {statusCode:500,error:{message:'Invalid id.'}}
        }

        let id = 0
        try{
            id = parseInt(req.params.id)
            console.log('352: ')

        }
        catch(ex){
                console.log(ex.stack)
                return {statusCode:500}
        }

        if(id > 0){
            console.log(`361: id=${id}`)


        }
        else{
            console.log('364: Invalid id.')
            return {statusCode:500}
        }
        

        
        let account = await CommonService.getAccount(req.session.user.username)
    
        if(account['username'] == null ){

            
            return {statusCode:500,error:{message:'377: Invalid account'}}
        }

        await accountTable.update({username:account.username},{$pull:{wallets:{id:id}}})
        
        
        console.log(`386: w= ${JSON.stringify(w,null,4)}`)
            
/*
    db.accounts.aggregate([
        {$match:{username:'test2'}},
        {$unwind:'$wallets'},
        {$match:{'wallets.id':1725245620559}},
        {$project:{'wallets':1}}
    ]).pretty()


    db.accounts.update({username:'test2'},{$pull:{wallets:{id:1725314794937}}})


    */

    if(w.length > 0)
    {
        console.log('393: Invalid id.')
        w = w[0]
        w = {id:id,address:w.wallets.address,is_default:w.wallets.is_default}
    }
    else{
        console.log('397: Invalid id.')
    }
    
    
    
    return {statusCode:200,data:w}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`386.10: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:config.error_processing}}

}


exports.getAddProduct = async function(req){
    console.log(`386.0: START account.service  get_editwallet(req.body= ${JSON.stringify(req.params,null,4)}`)
    try{

        if(req.params['id'] == null){
            return {statusCode:500,error:{message:'Invalid id.'}}
        }

        let id = 0
        try{
            id = parseInt(req.params.id)
            console.log('352: ')

        }
        catch(ex){
                console.log(ex.stack)
                return {statusCode:500}
        }

        if(id > 0){
            console.log(`361: id=${id}`)


        }
        else{
            console.log('364: Invalid id.')
            return {statusCode:500}
        }
        

        
        let account = await CommonService.getAccount(req.session.user.username)
    
        if(account['username'] == null ){

            
            return {statusCode:500,error:{message:'377: Invalid account'}}
        }

        let w = await accountTable.aggregate([
            {$match:{username:account.username}},
            {$unwind:'$wallets'},
            {$match:{'wallets.id':id}},
            {$project:{'wallets':1}}
        ])

        console.log(`386: w= ${JSON.stringify(w,null,4)}`)
            
/*
    db.accounts.aggregate([
        {$match:{username:'test2'}},
        {$unwind:'$wallets'},
        {$match:{'wallets.id':1725245620559}},
        {$project:{'wallets':1}}
    ]).pretty()
    */

    if(w.length > 0)
    {
        console.log('393: Invalid id.')
        w = w[0]
        w = {id:id,address:w.wallets.address,is_default:w.wallets.is_default}
    }
    else{
        console.log('397: Invalid id.')
    }
    
    
    
    return {statusCode:200,data:w}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`386.10: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:config.error_processing}}

}


exports.postAddProduct = async function(req){
    console.log(`427.0: START account.service  post_editwallet(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    if(req.body['wallet_address'] != null && req.body.wallet_address.length >= 12){
        console.log(`427.1:`)
    }
    else{
        console.log(`386.1: Invalid wallet_address`)
        return {statusCode:501}
    }


    

    let wallet_address = req.body.wallet_address

    if(req.body['wallet_id'] == null){
        console.log(`427.2:`)
        return {statusCode:500,error:{message:'Invalid id.'}}
    }

    let wallet_id = 0
    try{
        wallet_id = parseInt(req.body.wallet_id)

    }
    catch(ex){
            console.log(ex.stack)
            return {statusCode:500}
    }

    console.log(`427.3:`)
    if(wallet_id > 0){

    }
    else{
        console.log('Invalid id.')
        return {statusCode:500}
    }
    let username = req.session.user.username
    
    
    let account = await CommonService.getAccount(username)
    if(account && account.username) {
        console.log(`386.2: DEBUG account.service}`)
    }
    else{
        console.log(`386.4: Invalid account`)
        return {statusCode:502}
    }

    if(account.wallets == null){
        account.wallets = []
    }
    
    console.log(`427.4:`)

    let existing_wallet = null
    if(account.wallets.length > 0){
        console.log(`386.5:`)
        //const result = inventory.find(({ name }) => name === "cherries");
        existing_wallet = account.wallets.find(( {id}) => id === wallet_id )
        
    }

    

    if(existing_wallet){
        let has_changed = false
        console.log(`427.6: `)
        if(req.body['is_default'] != null){
            if(existing_wallet.is_default !== req.body.is_default    ){
                existing_wallet.is_default =  req.body.is_default    
                has_changed = true
            }
         
        } 
        
        
        if(existing_wallet.address !== wallet_address){
            existing_wallet.address = wallet_address
            has_changed = true
            
        }
        if(has_changed){
            console.log(`427.7: has_changed is true  `)
            await accountTable.update({username:username},{$set:{wallets:account.wallets}})

        }
        
    }
    else{
        console.log(`427.7: existing_wallet is null  `)
        //await account.wallets.push({address:wallet_address,is_default:is_default})
        //account.wallets.push({id:Date.now(), address:wallet_address,is_default:is_default})
        //await accountTable.update({username:username},{$set:{wallets:wallets}})
    
        
    }

    console.log(`427.8: existing_wallet is null  `)
        
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`427.9: DEBUG myaccount.service}`)

    return {statusCode:500}

}


exports.getChangePassword = async function(req){
    
    
    return {statusCode:200,data:w}
  

}

exports.postChangePassword = async function(req){
    console.log(`643: START account.service  postChangePassword(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

        let new_password = req.body['new_password']
        if(new_password && new_password.length>=6){

        }
        else{
            return {statusCode:500,error:{message:'Invalid pasword. Must be atleast 6 alphanumeric characters.'}} 
        }
        
        
        
        let account = await CommonService.getAccount(req.session.user.username)
    
        if(account['username'] == null ){

            
            return {statusCode:500,error:{message:'661: Invalid account'}}
        }


        let hash = await CommonService.getPasswordHash(new_password) 
        
        console.log(`667: hash= ${JSON.stringify(hash)}`)
        if(hash && hash.length > 0){

            await accountTable.update({username:account.username},{$set:{password:hash}})
        
        }
        else{
            return {statusCode:500,error:{message:config.error_processing}}
        }
        
        
        
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`687: myaccount.service  postChangePassword ex= ${JSON.stringify(ex.stack,null,4)}`)
    }
    console.log(`689: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:config.error_processing}}

}

exports.getEditBillingAddress = async function(req){
    console.log(`386.0: START account.service  get_editwallet(req.body= ${JSON.stringify(req.params,null,4)}`)
    try{

        
        
        
        let account = await CommonService.getAccount(req.session.user.username)
    
        if(account['username'] == null ){

            
            return {statusCode:500,error:{message:'377: Invalid account'}}
        }

        
        
        
        return {statusCode:200,data:account.userinfo.billing_address}
    
    
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`386.10: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:config.error_processing}}

}

exports.postEditBillingAddress = async function(req){
    
    console.log(`427.0: START account.service  post_editwallet(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    if(req.body['billing_address'] != null){
        console.log(`427.1:`)
    }
    else{
        console.log(`386.1: Invalid shipping_address`)
        return {statusCode:501}
    }


    

    let billing_address = req.body.billing_address

    
    
    let username = req.session.user.username
    
    
    let account = await CommonService.getAccount(username)
    if(account && account.username) {
        console.log(`386.2: DEBUG account.service}`)
    }
    else{
        console.log(`386.4: Invalid account`)
        return {statusCode:502}
    }

    let address = await CommonService.geocode(billing_address)
    if(address){
        console.log(`761: ${JSON.stringify(address,null,4)}`)
        
    }

    
    
            //console.log(`427.7: has_changed is true  `)
        if(address.address){
            await accountTable.update({username:username},{$set:{'userinfo.billing_address':address}})

        }
            
            
    console.log(`427.8: existing_wallet is null  `)
        
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex.stack,null,4)}`)
    }
    console.log(`427.9: DEBUG myaccount.service}`)

    return {statusCode:500}

}


exports.getEditShippingAddress = async function(req){
    console.log(`386.0: START account.service  get_editwallet(req.body= ${JSON.stringify(req.params,null,4)}`)
    try{

        
        
        
        let account = await CommonService.getAccount(req.session.user.username)
    
        if(account['username'] == null ){

            
            return {statusCode:500,error:{message:'377: Invalid account'}}
        }

        
        
        
        return {statusCode:200,data:account.userinfo.shipping_address}
    
    
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`386.10: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:config.error_processing}}

}

exports.postEditShippingAddress = async function(req){
    console.log(`427.0: START account.service  post_editwallet(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{

    if(req.body['shipping_address'] != null){
        console.log(`427.1:`)
    }
    else{
        console.log(`386.1: Invalid shipping_address`)
        return {statusCode:501}
    }


    

    let shipping_address = req.body.shipping_address

    
    
    let username = req.session.user.username
    
    
    let account = await CommonService.getAccount(username)
    if(account && account.username) {
        console.log(`386.2: DEBUG account.service}`)
    }
    else{
        console.log(`386.4: Invalid account`)
        return {statusCode:502}
    }

    let address = await CommonService.geocode(shipping_address)
    if(address){
        console.log(`761: ${JSON.stringify(address,null,4)}`)
        
    }

    
    
            //console.log(`427.7: has_changed is true  `)
        if(address.address){
            await accountTable.update({username:username},{$set:{'userinfo.shipping_address':address}})

        }    
            
    console.log(`427.8: existing_wallet is null  `)
        
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex.stack,null,4)}`)
    }
    console.log(`427.9: DEBUG myaccount.service}`)

    return {statusCode:500}

}

exports.getEditCompanyInfo = async function(req){
    console.log(`386.0: START account.service  get_editwallet(req.body= ${JSON.stringify(req.params,null,4)}`)
    try{

        
        
        
        let account = await CommonService.getAccount(req.session.user.username)
    
        if(account['username'] == null ){

            
            return {statusCode:500,error:{message:'377: Invalid account'}}
        }

        
        
        
        return {statusCode:200,data:account.companyinfo}
    
    
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex,null,4)}`)
    }
    console.log(`386.10: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:config.error_processing}}

}

exports.postEditCompanyInfo = async function(req){
    console.log(`427.0: START account.service  postEditCompanyInfo(req.body= ${JSON.stringify(req.body,null,4)}`)
    try{
/*
    if(req.body['shipping_address'] != null){
        console.log(`427.1:`)
    }
    else{
        console.log(`386.1: Invalid shipping_address`)
        return {statusCode:501}
    }
*/

    
    let username = req.session.user.username
    
    
    let account = await CommonService.getAccount(username)
    if(account && account.username) {
        console.log(`386.2: DEBUG account.service}`)
    }
    else{
        console.log(`386.4: Invalid account`)
        return {statusCode:500,error:{message:'Invalid account.'}}
    }

    let companyinfo = {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        
    }


    if(companyinfo.address){
        companyinfo.address = await CommonService.geocode(companyinfo.address)
    }
    else{
        companyinfo.address = config.default_billing_address
    }

    
    
    await accountTable.update({username:username},{$set:{'companyinfo':companyinfo}})

    
    console.log(`427.8: existing_wallet is null  `)
        
    
    return {statusCode:200}
    //}
    //console.log(`53.6: DEBUG account.service}`)
    }
    catch(ex)
    {
        
        console.log(`386.9: myaccount.service  post_addwallet ex= ${JSON.stringify(ex.stack,null,4)}`)
    }
    console.log(`427.9: DEBUG myaccount.service}`)

    return {statusCode:500,error:{message:'Error'}}

}
