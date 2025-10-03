//const express = require('express');
//const router = express.Router();
//const crypto = require('crypto')
const config = require('../config/config')

const path = require('path')
const util = require('util');
const bcrypt = require('bcrypt')
const request = require("../../ShoppingCart/node_modules/request");
const requestPromise = util.promisify(request);

//var bcryptCompareAsync = util.promisify(bcrypt.compare)//util.promisify(req.files.photo.mv)

//const EmailService = require('../services/email.service')
const {v4:uuid} = require('uuid')
var fs = require('fs');
const fsExists = util.promisify(fs.exists)
const fsMkdir = util.promisify(fs.mkdir)

const monk = require('monk');
const e = require('express');
const db = monk(config.kMongoDb)
const accountTable = db.get('accounts')

const categoryTable = db.get('categories'); 
const brandTable = db.get('brands');    
const productsTable = db.get('products');
const settingTable = db.get('settings');
const productlastidTable = db.get('productlastid');   
const recentlyviewedTable = db.get('recentlyviewed');
const exchangeratesTable = db.get('exchangerates')
const geocodeTable = db.get("geocodes")

async function wrapedHash(password){
    return new Promise((resolve,reject)=>{
    //let transporter = nodemailer.createTransport({//settings});
    bcrypt.hash(password, 13, function(err, hash) {

        if(err){
            console.log(err)
            resolve('') 
        }
        else{
            resolve(hash);
            }
        });
    })
}


//exports.get_categories = async function(req_session){
    async function funcFixProductIfNeeded(existing_product){
        if(existing_product["is_published"] == null ){
            qry_set["is_published"] = false
            
            
        }
    
        if(existing_product["is_onsale"] == null ){
            qry_set["is_onsale"] = false
            
           
        }
        
        if(existing_product["is_dealoftheday"] == null ){
            qry_set["is_dealoftheday"] = false
            
            
        }
        if(existing_product["is_new"] == null){
            qry_set["is_new"] = false
            
            
        }
        
                
        if(existing_product["upload1"] == null || existing_product.upload1.length == 0){
            qry_set["upload1"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
            
           
        }
        if(existing_product["upload2"] == null || existing_product.upload2.length == 0){
            qry_set["upload2"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
            
        }
        if(existing_product["upload3"] == null || existing_product.upload3.length == 0){
            qry_set["upload3"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
            
        }
        if(existing_product["upload4"] == null || existing_product.upload4.length == 0){
            qry_set["upload4"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
            
        }
        if(existing_product["upload5"] == null || existing_product.upload5.length == 0){
            qry_set["upload5"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
            
        }
        if(existing_product["upload6"] == null || existing_product.upload6.length == 0){
            qry_set["upload6"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
            
        }

        if(existing_product["product_code"] == null){
            qry_set["product_code"] = ""
           
        }
    
        if(existing_product["editor1"] == null){
            qry_set["editor1"] = ""
           
        }
        
        if(existing_product["currency"] == null){
            qry_set["currency"] = config.default_currency
            
        }

        
        if (Object.keys(qry_set).length > 0){
            await productsTable.update({createdby:username,guid:existing_product.guid},{$set:qry_set})
    
            existing_product = await productsTable.findOne(qry)
        }

        return existing_product
        
    }
    
    async function validateAddress(address, address2){
        //const accountTable = db.get('accounts')
        try{
            var ret  = await myutils.geocode(address)
            
            ret.verified = 0
            address = ret.address
            if(address2 && address2.length > 0){
                ret.address['address2'] = address2
            }
            mylogger.log(`\r\nvalidateAddress PASSED ret=${JSON.stringify(ret)}\r\n`)
            return ret
        }
        catch(err){
            error_message = `Address validation error.!` 
            mylogger.log(`!!!!! 85: validateAddress err= ${JSON.stringify(err.stack)}`)
            //return {error: error_message}
            return {error:{message:error_message}}
        }
        
    
        
    }
    

exports.getPasswordHash = async function(password){
    return await wrapedHash(password)
}

    
exports.get_product_by_id = async (id) => {
        //let qry = {id:id}
        //console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
        let existing_product = await productsTable.findOne({id:id})
        if(existing_product == null ||  existing_product['id'] == null){
            
            console.log(`324: Product by id  ${id} DOES NOT exists!`)
            return {statusCode:500}
        }
        else{
            existing_product = funcFixProductIfNeeded(existing_product)
            
            return {statusCode:200,data:existing_product}
        }

    }

    exports.get_product_by_guid = async (guid) => {
        //let qry = {id:id}
        //console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
        let existing_product = await productsTable.findOne({guid:guid})
        if(existing_product == null ||  existing_product['id'] == null){
            
            console.log(`324: Product by guid  ${id} DOES NOT exists!`)
            return {statusCode:500}
        }
        else{
            existing_product = funcFixProductIfNeeded(existing_product)
            
            return {statusCode:200,data:existing_product}
        }

    }
     

exports.get_basic_data = async function(req_session){
    
    //let username = req_session['username'] != null ? req_session.username : ''
    let results = []
        
    let categories = await categoryTable.find({status: true})

    let menu_categories = []

    if(categories.length > 0){
        
        menu_categories = await categoryTable.find({parent_id:"0"})

        if(menu_categories != null){

            for(mc of menu_categories){
                mc.children= await categoryTable.find({parent_id: mc.id})
                if(mc.children == null){
                    mc.children = []
                }
            }
        }
        else{
            menu_categories = []
        }
    }

    //let eth = 0.0
    /*
    let existing_exch = await exchangeratesTable.findOne({id:'USD'})
    
    try {

        
        
        let is_fetch = false
        if(existing_exch == null) is_fetch = true
        else if (existing_exch.updated != null){ 
            console.log(`DEBUG 179.0:`)
            let d1 = existing_exch.updated.setMinutes(existing_exch.updated.getMinutes() + 2)
            let d2 = Date.now()
            console.log(`180: d1= ${d1} d2= ${d2}`)
            if(d1 <= d2 ){
                console.log(`DEBUG 179.1:`)
                is_fetch = true
            }
            console.log(`DEBUG 179.3:`)
            
            
            
        }

        console.log(`193: is_fetch= ${is_fetch}`)
        
        if(is_fetch)    {

                const resp = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD')
                //const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
                console.log('194: Status Code:', resp.status);
                //console.log('Date in Response header:', headerDate);
            
                const resp_json = await resp.json();
            
                
                //{"data":{"currency":"USD","rates":{"00":"33.9558573853989813","ETH":"0.0004296261607962","ETH2":"0.0004296261607962",...
                //console.log(`resp_json: ${JSON.stringify(resp_json,null,4)}`);

                await exchangeratesTable.update({id:'USD'},{$set:{updated:new Date(), data: resp_json.data}},{upsert:true})

                
                existing_exch = await exchangeratesTable.findOne({id:'USD'})
            


            }
            
            
            
            eth = parseFloat(existing_exch.data.rates.ETH)
                
            
        
        } catch (err) {
        console.log(`209: error= ${err.message}`); //can be console.error
        }

        
        if(eth <= 0){
            console.log('211: ETH value is invalid!')
            return {statusCode:500}
        }
    */
    let currency = await exports.get_mycurrency(req_session) //config.default_currency

    let eth = await exports.get_eth_rates(currency)

    console.log(`237: common.service get_basic_data eth= ${JSON.stringify(eth,null,4)}`)

    if(eth.statusCode != 200){
        return {statusCode:eth.statusCode }
    }

    eth = eth.data
    //let currency_matched = false
    
    let cart = await exports.get_cart_data(req_session,currency,eth)

    console.log(`249: common.service get_basic_data cart= ${JSON.stringify(cart,null,4)}`)
    if(cart.statusCode != 200){
        return {statusCode:cart.statusCode}
    }

    cart =cart.data
    /*
    var count = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = {amount:0.0,currency:currency,eth:{amount:0.0}};
    var items = []
    if(count > 0){
        for( var item of req_session.cart) { 
            

            item['total'] = {
                amount: item.product.price.amount * item.quantity,
                currency: currency
            } 
            //item['total_eth'] = item.total * eth 
            
            sum.amount +=   item.total.amount
            items.push(item)
         }
         sum.eth.amount = sum * eth  
    }
    */
/*
var count = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = 0;
    var items = []
    if(req_session.cart.length > 0){
        for( var item of req_session.cart) { 
            sum += item.product.price * item.quantity
            items.push(item)
            
         }
        }
    let cart = {count:count, sum:sum,items: items}
*/
    let user = req_session.user
    if(user['is_admin'] == null){
        user['is_admin'] = false
    }
    
    let data = {
        categories: categories, 
        menu_categories: menu_categories, 
        /*cart:{
            items:items, 
            count:count, 
            currency: currency,
            sum:sum, 
            //sum_eth: sum * eth  
        },
        */
       cart:cart,
        user:req_session.user,
        currency:currency,
        eth:eth,
        seller_wallet: config.seller_wallet
        
        
        //brands: brands, 
    
    }
    
    //console.log(`76: common.service get_basic_data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:data}

    
}



exports.get_cart_data = async function(req_session,currency,eth){
    
    
    
    //let eth = await exports.get_eth_rates(currency)
    /*
    let eth = 0.0
    
    let existing_exch = await exchangeratesTable.findOne({id:'USD'})
    try {

        
        
        let is_fetch = false
        if(existing_exch == null) is_fetch = true
        else if (existing_exch.updated != null){ 
            console.log(`DEBUG 179.0:`)
            let d1 = existing_exch.updated.setMinutes(existing_exch.updated.getMinutes() + 2)
            let d2 = Date.now()
            console.log(`180: d1= ${d1} d2= ${d2}`)
            if(d1 <= d2 ){
                console.log(`DEBUG 179.1:`)
                is_fetch = true
            }
            console.log(`DEBUG 179.3:`)
            
            
            
        }

        console.log(`193: is_fetch= ${is_fetch}`)
        
        if(is_fetch)    {

                const resp = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD')
                //const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
                console.log('194: Status Code:', resp.status);
                //console.log('Date in Response header:', headerDate);
            
                const resp_json = await resp.json();
            
                
                //{"data":{"currency":"USD","rates":{"00":"33.9558573853989813","ETH":"0.0004296261607962","ETH2":"0.0004296261607962",...
                //console.log(`resp_json: ${JSON.stringify(resp_json,null,4)}`);

                await exchangeratesTable.update({id:'USD'},{$set:{updated:new Date(), data: resp_json.data}},{upsert:true})

                
                existing_exch = await exchangeratesTable.findOne({id:'USD'})
            


            }
            
            
            
            eth = parseFloat(existing_exch.data.rates.ETH)
                
            
        
        } catch (err) {
        console.log(`209: error= ${err.message}`); //can be console.error
        return {statusCode:500}
        }
        */

        /*
        if(eth <= 0){
            console.log('211: ETH value is invalid!')
            return {statusCode:500}
        }
        */
    
    //let currency = config.default_currency
    //let currency_matched = false
        
    var count = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = {amount:0.0,currency:currency,eth:{amount:0.0}};
    var items = []
    if(count > 0){
        for( var item of req_session.cart) { 
            /*
            if(item.product['currency'] != null && item.product.currency !== currency.symbol){
                currency = item.product.currency
            }
            */
           /*if(!currency_matched){
                if(item.product.currency.currency !== currency.currency){
                    currency = item.product.currency
                    currency_matched = true
                }
            }*/

            item['total'] = {
                amount: item.product.price.amount * item.quantity,
                currency: currency
            } 
            //item['total_eth'] = item.total * eth 
            
            sum.amount +=   item.total.amount
            items.push(item)
         }
         sum.eth.amount = sum.amount * eth  
    }
/*
var count = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = 0;
    var items = []
    if(req_session.cart.length > 0){
        for( var item of req_session.cart) { 
            sum += item.product.price * item.quantity
            items.push(item)
            
         }
        }
    let cart = {count:count, sum:sum,items: items}
*/
    
    
    let data = {
        
        
        items:items, 
            count:count, 
            currency: currency,
            sum:sum, 
            //sum_eth: sum * eth  
        
            
        currency:currency,
        //eth:eth,
        //seller_wallet: config.seller_wallet
        
        
        //brands: brands, 
    
    }
    
    //console.log(`76: common.service get_basic_data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:data}

    
}


exports.get_categories = async function(req_session){
    
    //let username = req_session['username'] != null ? req_session.username : ''
    let results = []
        
    let categories = await categoryTable.find({status: true})

    let menu_categories = []

    if(categories.length > 0){
        
        menu_categories = await categoryTable.find({parent_id:"0"})

        if(menu_categories != null){

            for(mc of menu_categories){
                mc.children= await categoryTable.find({parent_id: mc.id})
                if(mc.children == null){
                    mc.children = []
                }
            }
        }
        else{
            menu_categories = []
        }
    }

    
    
    let data = {
        categories: categories, 
        menu_categories: menu_categories, 
        
        
        
    }
    
    //console.log(`76: common.service get_basic_data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:data}

    
}


exports.get_mycurrency = async function(req_session){
    let ret = config.default_currency
    if(req_session.user.roleId == 'customer' || req_session.user.roleId == 'admin'){
        let account = await accountTable.findOne({username: req_session.user.username})
        if(account){

            
            
            if(account['settings'] == null){
                account['settings']= {currency:config.default_currency}
                await accountTable.update({username:req_session.user.username},{$set:{settings:account.settings}})
                ret = account.settings.currency
                
            }

            else if(account.settings['currency'] == null){
                account.settings['currency'] = config.default_currency
                
                await accountTable.update({username:req_session.user.username},{$set:{settings:account.settings}})
                ret = account.settings.currency
            
            }
            else{
                ret = account.settings.currency
            }
            
        }
    }
    
    return ret
}

exports.get_eth_rates = async function(currency){
    
    //let username = req_session['username'] != null ? req_session.username : ''
    let results = []
    
    

    let eth = 0.0
    
    //let existing_exch = await exchangeratesTable.findOne({id:'USD'})
    let existing_exch = await exchangeratesTable.findOne({id:currency.currency})
    try {

        
        
        let is_fetch = false
        if(existing_exch == null) is_fetch = true
        else if (existing_exch.updated != null){ 
            console.log(`DEBUG 179.0:`)
            let d1 = existing_exch.updated.setMinutes(existing_exch.updated.getMinutes() + 2)
            let d2 = Date.now()
            console.log(`180: d1= ${d1} d2= ${d2}`)
            if(d1 <= d2 ){
                console.log(`DEBUG 179.1:`)
                is_fetch = true
            }
            console.log(`DEBUG 179.3:`)
            
            
            
        }

        console.log(`193: is_fetch= ${is_fetch}`)
        
        if(is_fetch)    {

                const resp = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD')
                
                //console.log('194: Status Code:', resp.status);
                
                
                const resp_json = await resp.json();
            
                
                //{"data":{"currency":"USD","rates":{"00":"33.9558573853989813","ETH":"0.0004296261607962","ETH2":"0.0004296261607962",...
                //console.log(`resp_json: ${JSON.stringify(resp_json,null,4)}`);

                await exchangeratesTable.update({id:'USD'},{$set:{updated:new Date(), data: resp_json.data}},{upsert:true})

                
                existing_exch = await exchangeratesTable.findOne({id:'USD'})
            


            }
            
            
            
            eth = parseFloat(existing_exch.data.rates.ETH)
        
            if(eth <= 0){
                console.log('211: ETH value is invalid!')
                return {statusCode:501}
            }
            
                
            return {statusCode:200, data:eth}
            
        
        } catch (err) {
        console.log(`209: error= ${err.message}`); //can be console.error/
        }

        /*
        if(eth <= 0){
            console.log('211: ETH value is invalid!')
            return {statusCode:500}
        }
        */
    
        
        
    
    
    
    //console.log(`76: common.service get_basic_data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:eth}

    
}

exports.get_data = async function(req_session){
    
    let username = req_session['username'] != null ? req_session.username : ''
    let results = []
        
    let categories = await categoryTable.find({status: true})

    let menu_categories = []

    if(categories.length > 0){
        
        menu_categories = await categoryTable.find({parent_id:"0"})

        if(menu_categories != null){

            for(mc of menu_categories){
                mc.children= await categoryTable.find({parent_id: mc.id})
                if(mc.children == null){
                    mc.children = []
                }
            }
        }
        else{
            menu_categories = []
        }
    }
    

    let brands = await brandTable.find({status: true})

    let orders = await ordersTable.find({username: username})
    

    let settings = await settingTable.find({})


    let featured_products = []
    let s  = settings.find(({ key }) => key === "featured_products");
    if(s.value){
        featured_products = await productsTable.find({status: true,is_published:true, is_featured:true}, { limit : s.value, sort : { id : -1 } })
        if(featured_products == null){
            featured_products = []
        }
    }

    let deals_of_the_day = []
    s  = settings.find(({ key }) => key === "deals_of_the_day");
    if(s.value){
        deals_of_the_day = await productsTable.find({status: true,is_published:true, is_dealoftheday:true}, { limit : s.value, sort : { id : -1 } })
        if(deals_of_the_day == null){
            deals_of_the_day = []
        }
    }

    let new_products = []
    s  = settings.find(({ key }) => key === "new_products");
    if(s.value){
        new_products = await productsTable.find({status: true,is_published:true, is_new:true}, { limit : s.value, sort : { id : -1 } })
        if(new_products == null){
            new_products = []
        }
    }

    let on_sale_products = []
    s  = settings.find(({ key }) => key === "on_sale_products");
    if(s.value){
        on_sale_products = await productsTable.find({status: true,is_published:true, is_onsale:true}, { limit : s.value, sort : { id : -1 } })
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
        featured_categories = await productsTable.find({status: true,is_published:true, is_featured:true}, { limit : s.value, sort : { id : -1 } })
        if(featured_categories == null){
            featured_categories = []
        }
    }
    
    var count = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = 0;
    var items = []
    if(count > 0){
        for( item of req_session.cart) { 
            
            sum += item.product.price * item.quantity
            items.push(item)
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
        cart:{count:count, sum:sum,items: items},
        
        home_slider: home_slider,
        user:{username: username}
    }
    
    console.log(`146: home.service index data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:data}

    
}


exports.fix_pricing_if_needed =  async function(existing_product){

    let currency = config.default_currency
    let qry_set = {}
    if(existing_product["currency"] == null){
        qry_set["currency"] = currency //{'name':'USD','symbol':'$'}
        existing_product["currency"]  = currency //{'name':'USD','symbol':'$'}
    }
    
    if(existing_product["price"] != null ){
        if(existing_product.price['amount'] == null){
            if(existing_product.price >= 0){
                existing_product.price = {
                    amount: existing_product.price,
                    original_amount:0.0,
                    percent_discount:0.0,
                    currency: currency
                }
            }
            else{
                existing_product.price = {
                    amount: 0.0,
                    discount_amount:0.0,
                    percent_discount:0.0,
                    currency: currency
                }
            }
            
            
            qry_set["price"] = existing_product.price
        }

        let perc = ((existing_product.price.original_amount-existing_product.price.amount)/existing_product.price.original_amount) * 100
        if(existing_product.percent_discount != perc){
            existing_product.percent_discount = perc
        }
        
        
        
    }
    else{
        existing_product.price = {
            amount: 0.0,
            original_amount:0.0,
            percent_discount:0.0,
            currency: currency,
            
        }
        qry_set["price"] = existing_product.price
    }

    if (Object.keys(qry_set).length > 0){
        await productsTable.update({guid:existing_product.guid},{$set:qry_set})

        existing_product = await productsTable.findOne({guid:existing_product.guid})
    }

}

exports.getAccount = async function(username){

    let account = await accountTable.findOne({username:username})
    if(account){
        let query_set = {}
            if(account['name'] == null){
                account['name'] = account['fullName'] != null ? account.fullName:''
             query_set['name'] = account.name
            }
 
            
            
            if(account['userinfo'] == null){
                account['userinfo'] = {
                 shipping_address: config.default_shipping_address,
                 billing_address: config.default_billing_address
             }
             query_set['userinfo'] = account.userinfo
             
            } 
            if(account['phone'] == null){
                account['phone'] = ''
             query_set['phone'] = account.phone
            }

            account['wallets'] = account.wallets

            if(account.wallets== null){
                account.wallets = []
                query_set['wallets'] = []
            }

            if(account.userinfo['billing_address'] == null){
                account.userinfo['billing_address'] = config.default_billing_address
                query_set['userinfo'] = account.userinfo 
            } 
        
            if(account.userinfo['shipping_address'] == null){
                account.userinfo['shipping_address'] = config.default_shipping_address
                query_set['userinfo'] = account.userinfo 
            } 

            if(account['companyinfo'] == null){
                account['companyinfo'] = {
                    name:'',
                    email:'',
                    phone:'',
                    address:'',
                    year_established:'',
                    total_employees:'',
                    category:''

                }
                query_set['companyinfo'] = account.companyinfo 
            } 
            else{
                if(account.companyinfo['phone'] == null){
                    account.companyinfo.phone = ''
                } 
                query_set['companyinfo'] = account.companyinfo 
            }
            
            //console.log(`253: query_set= ${JSON.stringify(query_set,null,4)}`)
            if(Object.keys(query_set).length > 0){
                //console.log('253: execute account update')
                 await accountTable.update({username:account.username},{$set:query_set})
            }
            //else{
                //console.log('253: No account update. All good')
                
           //}
            
            
            
                
            
    }
    
    
    
    
    return account
}

exports.geocode = async function(rawAddress){
    //check cached address
    //var string = "SomeStringToFind";
    var regex = new RegExp(["^", rawAddress, "$"].join(""), "i");
    // Creates a regex of: /^SomeStringToFind$/i
    
    var q = {query:{rawAddress: regex }}
    //console.log(`>>>>>>>>>> 27: myutils.service.js geocode() q= ${q}`)
        
    var result = await geocodeTable.find({rawAddress: regex })
    console.log(`\r\n\r\n\r\n >>>>>>>>>> 30: myutils.service.js geocode() result= ${JSON.stringify(result)}\r\n\r\n\r\n`)
    if(result && result.length > 0){
        result = result[0]
        console.log(`>>>>>>>>>> 49: myutils.service.js geocode() Found cached rawAddress in our geocode database!`)
        console.log(`>>>>>>>>>> 50: myutils.service.js geocode() return result.address= ${JSON.stringify(result.address)}`)
        return result.address
    }

    var urlEncodedAddress = encodeURIComponent(rawAddress)
    var address = {rawAddress: rawAddress}
    var apiKey = config.google_api_key
    /*
    
    var url = 'www.example.com'
    
    //function sendRequest(url){
    //string = 'http://localhost:3000/my-api-controller?url=' + url;
    
    string =`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${}`
    request.get(string, function(error, response, body){
        console.log(`body= ${body}`);
        callback(null, body);
    });
    */
    //}
    let url =`https://maps.googleapis.com/maps/api/geocode/json?address=${urlEncodedAddress}&key=${apiKey}`
    
    
    const response = await requestPromise(url)
    console.log('+++++ 38: response.body', response.body)
    try{
        let response_json = JSON.parse(response.body)
        console.log(`+++++ 43: response_json= ${JSON.stringify(response_json.results)}`)
        let result0= response_json.results[0]

        console.log(`\n+++++ 44: result0= ${JSON.stringify(result0)}`)
        
        var address_components = result0.address_components

        console.log(`\n+++++ 51: address_components= ${JSON.stringify(address_components)}`)

        address.rawAddress= rawAddress
        address.address= result0.formatted_address
        address.formattedAdress= result0.formatted_address
        address.latitude= result0.geometry.location.lat
        address.longitude= result0.geometry.location.lng
        
        
        console.log(`\n+++++ 60: address= ${JSON.stringify(address)}`)

        for(var i=0; i<address_components.length; i++)
        {
            let ac=address_components[i]
            //console.log(`\n+++++ 64: address_components[${i}].types[0]= ${JSON.stringify(address_components[i].types[0])}`)
            console.log(`\n+++++ 66: ac= ${JSON.stringify(ac)}`)
            console.log(`\n+++++ 67: ac.types[0]= ${JSON.stringify(ac.types[0])}`)
            
            switch(ac.types[0]){
                case 'street_number':
                    address.streetNumber=ac.long_name
                    break
                case 'route':
                    //address.streetName={longName:a.long_name,shortName:a.short_name}
                    address.streetName=ac.short_name
                    break
                case 'locality':
                    //address.city={longName:a.long_name,shortName:a.short_name}
                    address.city=ac.short_name
                    break
                case 'administrative_area_level_2':
                    //address.county={longName:a.long_name,shortName:a.short_name}
                    address.county=ac.short_name
                    break
                
                case 'administrative_area_level_1':
                    //address.state={longName:a.long_name,shortName:a.short_name}
                    address.state=ac.short_name
                    break
                case 'country':
                    //address.country={longName:a.long_name,shortName:a.short_name}
                    address.country=ac.long_name
                    address.countryCode=ac.short_name
                    break
                case 'postal_code':
                    //address.country={longName:a.long_name,shortName:a.short_name}
                    address.zipCode=ac.short_name
                    break
            
                
            }
        }
        

        
        console.log(`\r\n+++++ 88: getGeocode result= ${JSON.stringify(address)}`)
        result = await geocodeTable.insert({rawAddress:rawAddress,address:address})
        return address
    }
    catch(err){
        console.log(`\r\n!!!!! 92: getGeocode err= ${JSON.stringify(err)}`)
    }
    return address
}



