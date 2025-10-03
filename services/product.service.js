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
const productsTable = db.get('products');
const settingTable = db.get('settings');
const productlastidTable = db.get('productlastid');   
const CommonService = require('../services/common.service')   

function isValidSession(req_body){
    if(req_body == null || 
        req_body["session"] == null || 
        req_body.session["username"] == null ||
        req_body.session.username.length == 0 
        
        ){
                return false
    }
    return true
}




exports.index = async function(req_body){
    //var db = req.db;
    if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    
    let username = req_body.session.username
    let results = []
        
    let categories = await categoryTable.find({status: true})

    let brands = await brandTable.find({status: true})

    lastid= 0
    let resultlastid = await productlastidTable.findOne({username: username})
    if(resultlastid == null || resultlastid['productid'] == null){
        lastid = 1
        await productlastidTable.insert({username:username, productid:lastid})
    }
    if(resultlastid && resultlastid['id'] != null && resultlastid.id > 0){
        lastid = resultlastid.id + 1
        await productlastidTable.update({username:username},{$set:{productid:lastid}})
    }

    
    
    
        var created = dateTime.create().format('YmdHMS')
        
        
        
        var product = {
                id: lastid, 
                guid: uuidv4(),
                created: created,
                
                name: req.body.name, 
                price: parseFloat(req.body.price), 
                quantity: parseInt(req.body.quantity), 
                description: req.body.description,      
                photo: "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg", 
                special: req.body.special == 'true',
                views: 0,
                categoryId: req.body.categoryId,
                status: req.body.status == 'true',
                brandId: req.body.brandId
            };
        productsTable.insert(product, function(error, result){
            res.redirect('/vendor/product/edit');
        })
    
/*
    let cart = {}
    let settings  = {}
    
    let product = await productsTable.findOne({id: req.params.id})
    if (product && product['id'] != null ){
        if(req.session.cart == null) {
            req.session.cart = [{product: product, quantity: 1}];
        } 
        else {
            var index = -1;
            for(var i = 0; i < req.session.cart.length; i++) {
                if(req.session.cart[i].product.id == product.id) {
                    index = i;
                    break;
                }
            }
            if(index == -1) {
                req.session.cart.push({
                    product: product, quantity: 1
                });
            } else {
                req.session.cart[index].quantity++;
            }
            cart = req.session.cart
            
        }
    }
    */
                
       
    settings = settingTable.find({group: 'paypal'})
       
 
    var data = {categories: categories, brands: brands, cart: cart, settings: settings};

    return data
  
    
}


exports.product_page = async function(req_session,req_params) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`322: START product.service.js exports.product_page req_params=${JSON.stringify(req_params,null,4)}`)
    
    
    
    let username = req_session.user.username
    

    if(req_params == null || req_params["guid"] == null){
    
       
        console.log(`Product guid is missing!`)
        return {statusCode:500}
        
        
    } 
    let guid = req_params.guid

    let qry = {guid:guid}
    console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
    let existing_product = await productsTable.findOne(qry)
    if(existing_product == null ||  existing_product['guid'] == null){
        
        console.log(`324: Product ${guid} DOES NOT exists!`)
        return {statusCode:500}
    }

    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        
        return {statusCode:200}
    }

    let data = basic_data.data
    
    //data['categories'] = basic_data.categories
    //data['menu_categories'] = basic_data.menu_categories
    data['current_url'] = '/product/product-page' 
    

    await CommonService.fix_pricing_if_needed(existing_product)
    /*
    if(existing_product["currency"] == null){
        qry_set["currency"] = data.currency //{'name':'USD','symbol':'$'}
        existing_product["currency"]  = data.currency //{'name':'USD','symbol':'$'}
    }
    
    if(existing_product["price"] != null ){
        if(existing_product.price['amount'] == null){
            if(existing_product.price >= 0){
                existing_product.price = {
                    amount: existing_product.price,
                    original_amount:0.0,
                    percent_discount:0.0,
                    currency: data.currency
                }
            }
            else{
                existing_product.price = {
                    amount: 0.0,
                    discount_amount:0.0,
                    percent_discount:0.0,
                    currency: data.currency
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
            currency: data.currency,
            
        }
        qry_set["price"] = existing_product.price
    }
*/    
    /*

    if(existing_product["original_price"] == null ){
        
        
        existing_product["original_price"]  = {amount:0.0,currency:existing.currency,percent:0}
        qry_set["original_price"] = existing_product.original_price
    }


    
    if(existing_product.original_price.amount > 0 && existing_product.original_price.amount > existing_product.price.amount){
        let perc = ((existing_product.original_price.amount-existing_product.price.amount)/existing_product.original_price.amount) * 100
        if(existing_product.discount_price.percent != perc ){
            existing_product.discount_price.percent = perc
            qry_set["discount_price.percent"] = perc
        }
    }
    */

    let qry_set = {}
    if(existing_product["product_code"] == null){
        qry_set["product_code"] = ""
        existing_product["product_code"]  = ""
    }

    if(existing_product["editor1"] == null){
        qry_set["editor1"] = ""
        existing_product["editor1"]  = ""
    }
    
    

    /*
    is_published:false,
                is_onsale: false,
                is_dealoftheday:false,
                is_new:true,
                */

    if(existing_product["is_published"] == null ){
        qry_set["is_published"] = false
        
        existing_product["is_published"]  = false
    }

    if(existing_product["is_onsale"] == null ){
        qry_set["is_onsale"] = false
        
        existing_product["is_onsale"]  = false
    }
    
    if(existing_product["is_dealoftheday"] == null ){
        qry_set["is_dealoftheday"] = false
        
        existing_product["is_dealoftheday"]  = false
    }
    if(existing_product["is_new"] == null){
        qry_set["is_new"] = false
        
        existing_product["is_new"]  = false
    }

    if(existing_product["has_sizes"] == null ){
        qry_set["has_sizes"] = false
        
        existing_product["has_sizes"]  = false
    }
    
    if(existing_product["has_colors"] == null ){
        qry_set["has_colors"] = false
        
        existing_product["has_colors"]  = false
    }

    

            
    if(existing_product["upload1"] == null || existing_product.upload1.length == 0){
        qry_set["upload1"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
        
        existing_product["upload1"]  = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
    }
    if(existing_product["upload2"] == null || existing_product.upload2.length == 0){
        qry_set["upload2"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
        existing_product["upload2"]  = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
    }
    if(existing_product["upload3"] == null || existing_product.upload3.length == 0){
        qry_set["upload3"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
        existing_product["upload3"]  = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
    }
    if(existing_product["upload4"] == null || existing_product.upload4.length == 0){
        qry_set["upload4"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
        existing_product["upload4"]  = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
    }
    if(existing_product["upload5"] == null || existing_product.upload5.length == 0){
        qry_set["upload5"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
        existing_product["upload5"]  = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
    }
    if(existing_product["upload6"] == null || existing_product.upload6.length == 0){
        qry_set["upload6"] = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
        existing_product["upload6"]  = "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg"
    }
    if (Object.keys(qry_set).length > 0){
        await productsTable.update({createdby:username,guid:existing_product.guid},{$set:qry_set})

        existing_product = await productsTable.findOne(qry)
    }
    
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})
        
    data['product'] = existing_product
    data['related_products'] = await productsTable.find({categoryId:existing_product.categoryId})

    if(data.related_products == null) data.related_products = []

    
    return {statusCode:200,data:data}
    
    
}


exports.category_page = async function(req_session,req_params) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`279: START product.service.js exports.category_page req_params=${JSON.stringify(req_params,null,4)}`)
    
    
    
    let username = req_session.user.username
    

    if(req_params == null || req_params["slug"] == null){
    
       
        console.log(`Category is missing!`)
        return {statusCode:500}
        
        
    } 
    let slug = req_params["slug"] == null ? 'electronics': req_params["slug"]
    let current_page = req_params["page"] == null ? 1: parseInt(req_params["page"])
    //let id = req_params.id

    let qry = {slug:slug}
    console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
    
    
    let parent_cat = await categoryTable.findOne(qry)
    if(parent_cat == null ||  parent_cat['slug'] == null){
        
        console.log(`324: Category ${slug} DOES NOT exists!`)
        return {statusCode:500}
    }

    
    
    
    //let existing_cat = await categoryTable.findOne(qry)
    let existing_cat = await categoryTable.find({$or:[{id:parent_cat.id},{parent_id:parent_cat.id}]})
/*
    if(existing_cat == null ||  existing_cat['slug'] == null){
        
        console.log(`324: Category ${slug} DOES NOT exists!`)
        return {statusCode:500}
    }
    */

    

    console.log(`305: existing_cat = ${JSON.stringify(existing_cat,null,4)}`)
    

    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        
        return {statusCode:200}
    }

    let data = basic_data.data

    let existing_prods = []
    
    for(cat of existing_cat){
        let cat_prods = await productsTable.find({categoryId:cat.id})

        if(cat_prods && cat_prods.length > 0){
            
            //console.log(`324: Category ${guid} DOES NOT exists!`)
            //return {statusCode:500}
            for(prod of cat_prods){
                existing_prods.push(prod)
            }
        }

    }
    
    data['products'] = existing_prods

    
    
    //data['categories'] = basic_data.categories
    //data['menu_categories'] = basic_data.menu_categories
    data['current_url'] = 'product_page' 
    data['current_page'] = current_page //TODO
    
    data['category'] = existing_cat

    console.log(`335: product.service category_page() data =  ${JSON.stringify(data,null,4)}`)

    

    
    return {statusCode:200,data:data}
    
    
}
