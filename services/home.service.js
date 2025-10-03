const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const config = require('../config/config')

const path = require('path')
const util = require('util');
//const EmailService = require('../services/email.service')
const {v4:uuid} = require('uuid')
var fs = require('fs');
const fsExists = util.promisify(fs.exists)
const fsMkdir = util.promisify(fs.mkdir)

const monk = require('monk');
const db = monk(config.kMongoDb)
const accountTable = db.get('accounts')

const categoryTable = db.get('categories'); 
const brandTable = db.get('brands');    
const productTable = db.get('products');
const settingTable = db.get('settings');
const productlastidTable = db.get('productlastid');
const ordersTable = db.get('orders');
const orderdetailsTable = db.get('orderdetails');
const offersTable = db.get('offers');


const recentlyviewedTable = db.get('recentlyviewed');
const CommonService = require('../services/common.service')      

exports.index = async function(req_session){
    console.log('27: START home.service index')
    
    console.log(`49: home.service index req_session.user=${JSON.stringify(req_session.user)}`)
        

    let basic_data = await CommonService.get_basic_data(req_session)
    
    //console.log(`39: home.service index basic_data= ${JSON.stringify(basic_data,null,4)}`)

    if(basic_data.statusCode != 200){
        return {statusCode:500}
    }


    basic_data = basic_data.data

    let categories = basic_data.categories //await categoryTable.find({status: true})

    let menu_categories = basic_data.menu_categories //[]

    let cart = basic_data.cart

    let eth = basic_data.eth


    
    let user =  basic_data.user
    let username = user.username


    
    

    let results = []

/*
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
    */

    let brands = await brandTable.find({status: true})

    let settings = await settingTable.find({})


    let featured_products = []
    let s  = settings.find(({ key }) => key === "featured_products");
    if(s.value){
        featured_products = await productTable.find({status: true,is_published:true, is_featured:true}, { limit : s.value, sort : { id : -1 } })
        if(featured_products == null){
            featured_products = []
        }
    }
    if(featured_products.length > 0){
        for( p of featured_products){
            await CommonService.fix_pricing_if_needed(p)
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
    if(deals_of_the_day.length > 0){
        for( p of deals_of_the_day){
            await CommonService.fix_pricing_if_needed(p)
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
    if(new_products.length > 0){
        for( p of new_products){
            await CommonService.fix_pricing_if_needed(p)
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

    if(on_sale_products.length > 0){
        for( p of on_sale_products){
            await CommonService.fix_pricing_if_needed(p)
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
    if(featured_categories.length > 0){
        for( p of featured_categories){
            await CommonService.fix_pricing_if_needed(p)
        }
    }
    
    /*
    let count = req_session.cart == null ? 0 : req_session.cart.length;
    let sum = 0
    let items = []
    if(count > 0){
        for( ca of req_session.cart) { 
        
            items.push(ca)
            sum += ca.product.price * ca.quantity

         }
        }
    
    let cart = {count:count,sum:sum,items:items}
    */
   
    
        
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
        
        //brands: brands, 
        featured_products: featured_products, 
        deals_of_the_day: deals_of_the_day, 
        on_sale_products: on_sale_products, 
        your_recently_viewed_items: your_recently_viewed_items,
        new_products: new_products,
        
        featured_categories: featured_categories,
        menu_categories:menu_categories,
        
        currentUrl: 'home', 
        cart:cart,
        eth:eth,
        home_slider: home_slider,
        user:user
    }
    
    //console.log(`168: home.service index data = ${JSON.stringify(data,null,4)}`)

    return {statusCode:200,data:data}

    
}

exports.dashboard = async function(req_session){

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
        let account = await accountTable.findOne({username:data.user.username})
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

            if(data.user['wallets'] == null){
                data.user['wallets'] = []
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
     //}

     
    //let username = req_session['username'] != null ? req_session.username : ''
    //let results = []
    /*    
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
    */

    //let orders = await ordersTable.find({username: username})
    let summary ={total_orders:0,total_pending_orders:0,total_offers:0,total_pending_offers:0}

    let orders = await orderdetailsTable.find({username: username})

    if (orders == null){
        orders = []
    } 

//    let settings = await settingTable.find({})

/*
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
    */
    /*
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
*/
    //let userinfo = await accountTable.findOne({username:username},{shipping_address:1,billing_address:1})

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


