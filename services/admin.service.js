const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const dateTime = require('node-datetime')

const config = require('../config/config')
const multer = require('multer')
const path = require('path')
const util = require('util');
//const EmailService = require('../services/email.service')

//const {v4:uuid} = require('uuid')
const { v4: uuidv4 } = require('uuid')
var fs = require('fs');
const fs_exists = util.promisify(fs.exists)
const fs_mkdir = util.promisify(fs.mkdir)
const fs_rename = util.promisify(fs.rename)

const monk = require('monk');
const { execPath } = require('process');
const db = monk(config.kMongoDb)
const accountTable = db.get('accounts')
const currencyTable = db.get('currency')

const categoryTable = db.get('categories'); 
const brandTable = db.get('brands');    
const productsTable = db.get('products');
const ordersTable = db.get('orders');
const orderdetailsTable = db.get('orderdetails');
const offersTable = db.get('offers');

const settingTable = db.get('settings');
const productlastidTable = db.get('productlastid');   
const CommonService = require('../services/common.service')   


const uploads_tmp_path = '/home/rom/projects/walter/cryptibuyejs/ShoppingCart/public/uploads_tmp' //'/data/uploads.peerxc.com/uploads_tmp'
const uploads_path = '/home/rom/projects/walter/cryptibuyejs/ShoppingCart/public/uploads'



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


/*
 var db = req.db;
    var productTable = db.get('products'); 
    var brandTable = db.get('brands'); 
    productTable.find({}, {}, function(error, result){
        //res.render('admin/product/index', {products: result, currentUrl:'product'});
        res.render('vendor/product-list', {products: result, currentUrl:'product'});
    });     
*/
exports.dashboard = async function(req_session,req_body){
    //var db = req.db;
    /*
    if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    
    console.log(`57: START vendor.service.js dashboard(req_session= ${JSON.stringify(req_session,null,4)}, req_body= ${JSON.stringify(req_body,null,4)}`)
    
    let username = req_session.user.username
        
    let categories = await categoryTable.find({status: true})

    let brands = await brandTable.find({status: true})

    let products = await productsTable.find({vendor:username})
    
    let orders = await ordersTable.find({vendor:username})

    
    
    
    var data = {categories: categories != null ? categories:[] , 
        brands: brands != null ? brands:[], 
        products:products != null ? products: [], orders: orders != null ? orders : [],
        user:req_session.user,
        activemenu:'dashboard'
        
    };

    return {statusCode:200,data:data}
  
    
}

exports.product_list = async function(req_session,req_body){
    //var db = req.db;
    /*
    if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log('\r\n 86: --------------------- vendor.service.js products START ---------------------\r\n')
    
    
    let categories = await CommonService.get_categories(req_session)

    if(categories.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = categories.data
    data['user'] = req_session.user

    let username = data.user.username
    
    
    
    //let products = await productsTable.find({createdby:username})
    let products = await productsTable.find({})
        
    
    if(products == null){
        products = []
    }

    data['products'] = products

    data['current_url']='/admin/product-list'
    
    //let data = {categories: categories, brands: brands, products:products,current_url:'product_list'};

    return {statusCode:200, data:data}
  
    
}


exports.add_product = async function(req_session,req_body){
    console.log(`166: START exports.add_product`)
    //var db = req.db;
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
   try{

    
   
    let user = req_session.user
    let username = user.username
    //let results = []
        
   // let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})

    /*
    lastid= 0
    let resultlastid = await productlastidTable.findOne({username: username})
    if(resultlastid == null || resultlastid['lastid'] == null){
        lastid = 1
        await productlastidTable.insert({username:username, lastid:lastid})
    }
    if(resultlastid && resultlastid['id'] != null && resultlastid.id > 0){
        lastid = resultlastid.id + 1
        await productlastidTable.update({username:username},{$set:{lastid:lastid}})
    }
    */
    var created = dateTime.create().format('YmdHMS')
   let new_id = `${username}-${created}`
        var product = {
                id: new_id, 
                guid: uuidv4(),
                created: created,
                createdby: username,
                
                name: 'New Product', 
                price: 0.0,//parseFloat(req.body.price), 
                original_price: 0.0,
                currency: user.currency,
                discount: 0.0,
                quantity: 1,//parseInt(req.body.quantity), 
                editor1: "",//req.body.description,      
                upload1: "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg", 
                upload2: "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg", 
                upload3: "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg", 
                upload4: "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg", 
                upload5: "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg", 
                upload6: "https://cryptibuy3.romnix.com/vendor/assets/images/pro3/1.jpg", 
                special: false,//req.body.special == 'true',
                views: 0,
                categoryId: 8, //electronix //req.body.categoryId,
                status: true,//req.body.status == 'true',
                is_published:false,
                is_onsale: false,
                is_dealoftheday:false,
                is_featured:false,
                is_new:true,

                brandId: 0//req.body.brandId
            };

            console.log(`166: insert product = ${JSON.stringify(product)}`)
        await productsTable.insert(product)
        console.log(`166: OK`)
        return {statusCode:200, data: product}
            
   }
   catch(err) {

    console.log(`err= ${JSON.stringify(err,null,4)}`)
    }

    return {statusCode:500}
       
  
    
}

exports.remove_product = async function(req_session,req_params) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`184: START vendor.service.js exports.remove_product req_params=${JSON.stringify(req_params,null,4)}`)
    
    let username = req_session.user.username
    
    if(req_params == null || req_params["guid"] == null){
    
       
        console.log(`Product guid is missing!`)
     
        
        
    } 
    else{
   // let qry = {createdby:username, guid:req_params.guid}
   // console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
    
    await productsTable.remove({guid:req_params.guid})
    }
    
    return {statusCode:200}
            
}


exports.edit_product = async function(req_session,req_params) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`184: START vendor.service.js exports.edit_product req_params=${JSON.stringify(req_params,null,4)}`)
    
    let categories = await CommonService.get_categories(req_session)

    if(categories.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = categories.data
    data['user'] = req_session.user

    let user = data.user
    let username = user.username
    

    if(req_params == null || req_params["guid"] == null){
    
       
        console.log(`Product guid is missing!`)
        return {statusCode:500}
        
        
    } 
    let guid = req_params.guid

    let qry = {guid:guid}
    console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
    let existing_product = await productsTable.findOne(qry)
    if(existing_product == null ||  existing_product['guid'] == null){
        
        console.log(`Product ${guid} DOES NOT exists!`)
        return {statusCode:500}
    }

    let qry_set = {}
    if(existing_product["product_code"] == null){
        qry_set["product_code"] = ""
        existing_product["product_code"]  = ""
    }

    if(existing_product["editor1"] == null){
        qry_set["editor1"] = ""
        existing_product["editor1"]  = ""
    }

    if(existing_product["currency"] == null){
        qry_set["currency"] = user.currency
        existing_product["currency"]  = user.currency
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
    if(existing_product["is_featured"] == null){
        qry_set["is_featured"] = false
        
        existing_product["is_featured"]  = false
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
        await productsTable.update({guid:existing_product.guid},{$set:qry_set})

        existing_product = await productsTable.findOne(qry)
    }
    
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})
        
    //let data = {categories: categories, brands: brands, product:existing_product}
    
    data['product'] = existing_product
        
    
        //res.redirect(`/vendor/product/edit/${existing_product.guid}`);
        
        return {statusCode:200,data:data}
            
}



exports.save_product = async function(req) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`313: START exports.save_product (req.body= ${JSON.stringify(req.body,null,4)}`)

    
    let req_session = req.session
    let user = req_session.user
    let username = user.username
    
    let req_body = JSON.parse(JSON.stringify(req.body))

    if(req_body == null && req_body["guid"] == null){
    
       
        console.log(`Product guid is missing!`)
        return {statusCode:500}
        
        
    } 
   
    console.log(`327: Save product req_body = ${JSON.stringify(req_body,null,4)}`)

    let qry_product = {guid:req_body.guid}
    console.log(`202: Product qry_product = ${JSON.stringify(qry_product,null,4)}`)
    let existing_product = await productsTable.findOne(qry_product)
    if(existing_product == null ||  existing_product['guid'] == null){
        
        console.log(`Product ${req_body['guid']} DOES NOT exists!`)
        return {statusCode:500}
    }

    if(existing_product["product_code"] == null){
        existing_product["product_code"]  = ""
    }
    if(existing_product["editor1"] == null){
        existing_product["editor1"]  = ""
    }
    
    /*
    if(existing_product["currency"] == null){
        qry_set["currency"] = {'name':'USD','symbol':'$'}
        existing_product["currency"]  = {'name':'USD','symbol':'$'}
    }
    */



    /*
        let photo = `${config.kRootUrl}/vendor/assets/images/pro3/1.jpg`
        if(req.files && req.files.photo != null) {
            try{
            
                //console.log(`\r\n\r\n\r\n25: --------------------------`)
                console.log(`\r\n\r\n 134: req.files.photo OK`)
                
                //check valid
                let filename = req.files.photo.name
                console.log(`\r\n\r\n 134: filename= ${filename}`)

                let extname = path.extname(filename)
                console.log(`\r\n\r\n ---------------------\r\n31: req.files.photo extname = ${extname}`)
                let extnames = '.jpg .png .gif .jpeg'
                //if(extname in ['.jpg','.png','.gif','.jpeg']){
                if(extnames.includes(extname)){
                    console.log(`\r\n\r\n 31: req.files.photo extname ${extname} OK`)
                
                    var userDir = path.join(`./public/images/${username}`)
                    if (! await fsExists(userDir)){
                    console.log(`\r\n ${userDir} does not exists. Attempt to create.\r\n`)
                        await fsMkdir(userDir);
                    }
                    else{
                    console.log(`\r\n ${userDir} exists!\r\n`)
                    }
                
                    let mv = util.promisify(req.files.photo.mv)
                    let mv_result = await mv(path.join(`${userDir}/`,  filename))
                    console.log(`\r\n\r\n\r\n >>>>>>>>>> 33: post /edit mv_result= ${mv_result} \r\n\r\n\r\n`)

                    photo = `${config.kRootUrl}/uploads/images/${username}/${filename}`                    
                    
                }
            }
            catch(err) {
                if (err)
                    console.log('185: Photo upload failed!')
                
            }          
        }
        */

        let qry_set = {}
        
        
        //req_body['photo'] = photo

        /*
        if(req_body['special'] != null){
            req_body.special =  req_body.special == 'on'

        }
        
        if(req_body['status'] != null){
            req_body.status =  req_body.status == 'on'
        }
        */

        
        qry_set['is_published'] = req_body.is_published == 'on' ? true : false
        qry_set['is_onsale'] = req_body.is_onsale == 'on' ? true : false
        qry_set['is_new'] = req_body.is_new == 'on' ? true : false
        qry_set['is_dealoftheday'] = req_body.is_dealoftheday == 'on' ? true : false
        qry_set['is_featured'] = req_body.is_featured == 'on' ? true : false
        
        
        
            //convert string numbers if needed 
        if(req_body['price'] != null){
            qry_set['price'] = parseFloat(req_body.price)
        }
        
        if(req_body['currency'] != null){
            
            let currency = await currencyTable.findOne({name:req_body.currency})
            if(currency){
                qry_set['currency'] = currency

            }
            
            
            
            
        }
        

        if(req_body['quantity'] != null){
            qry_set['quantity'] = parseInt(req_body.price)
        }

        
                
                    

        for (const [key, value] of Object.entries(req_body)) {
            //console.log(key, value);
            switch(key){
                case 'id':
                case 'guid':
                case '_id':
                case 'created':
                case 'createdby':
                case 'files':
                case 'is_published':
                case 'is_onsale':
                case 'is_new':
                case 'is_dealoftheday':
                    
                    
                    break
                /*case 'editor1':
                    req_body[key] != existing_product[key]
                    qry_set[key] = value
                    existing_product['description'] = value
                    break
                */
                    
                default:
                    if(existing_product[key] != null){
                        req_body[key] != existing_product[key]
                        qry_set[key] = value
                    }

                    break
                
                    
            }
            
          }

        if(Object.keys(qry_set).length === 0){
            return {statusCode:200,data:existing_product}
            
        }
        


        
        qry_set['updated'] = dateTime.create().format('YmdHMS')

        console.log(`447: Save product qry_set= ${ JSON.stringify(qry_set,null,4)}`)
        
        
        await productsTable.update({guid:existing_product.guid},{$set:qry_set})

        console.log(`447: Save product SUCCESS`)
        
        
        
        existing_product = await productsTable.findOne(qry_product)



        //res.redirect(`/vendor/product/edit/${existing_product.guid}`);
        
        return {statusCode:200,data:existing_product}
            
}

exports.product_detail = async function(req_session,req_params) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`184: START vendor.service.js exports.exports.product_detail = async function(req_session,req_params) { 
        req_params=${JSON.stringify(req_params,null,4)}`)
    
    let categories = await CommonService.get_categories(req_session)

    if(categories.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = categories.data
    data['user'] = req_session.user
    
    let username = data.user.username
    

    if(req_params == null || req_params["guid"] == null){
    
       
        console.log(`Product guid is missing!`)
        return {statusCode:500}
        
        
    } 
    let guid = req_params.guid

    let qry = {guid:guid}
    console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
    let existing_product = await productsTable.findOne(qry)
    if(existing_product == null ||  existing_product['guid'] == null){
        
        console.log(`Product ${guid} DOES NOT exists!`)
        return {statusCode:500}
    }

    let qry_set = {}
    if(existing_product["product_code"] == null){
        qry_set["product_code"] = ""
        existing_product["product_code"]  = ""
    }

    if(existing_product["description"] == null){
        qry_set["description"] = ""
        existing_product["description"]  = ""
    }
    
    if(existing_product["currency"] == null){
        qry_set["currency"] = {'name':'USD','symbol':'$'}
        existing_product["currency"]  = {'name':'USD','symbol':'$'}
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
        await productsTable.update({guid:existing_product.guid},{$set:qry_set})

        existing_product = await productsTable.findOne(qry)
    }
    
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})
        
    //let data = {categories: categories, brands: brands, product:existing_product}
    data['product'] = existing_product
        
    
        //res.redirect(`/vendor/product/edit/${existing_product.guid}`);
        
        return {statusCode:200,data:data}
            
}

exports.order_list = async function(req_session,req_body){
    
    console.log('\r\n 86: --------------------- vendor.service.js products START ---------------------\r\n')
    
    let categories = await CommonService.get_categories(req_session)

    if(categories.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = categories.data
    data['user'] = req_session.user
    
    
    
    
    
   //let products =  await orderdetailsTable.find({seller:data.user.username})
   let products =  await orderdetailsTable.find({})
        
    
    if(products == null){
        products = []
    }

    data['products'] = products
    data['current_url'] = '/admin/order-list'
    
    //let data = {categories: categories, brands: brands, products:products,current_url:'/vendor/order-list'};

    return {statusCode:200, data:data}
  
    
}

exports.offer_list = async function(req_session,req_body){
    //var db = req.db;
    /*
    if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log('\r\n 86: --------------------- vendor.service.js offer_list START ---------------------\r\n')
    
    
    let categories = await CommonService.get_categories(req_session)

    if(categories.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = categories.data
    data['user'] = req_session.user
    

    
    
    //let offers =  await offersTable.find({vendor:data.user.username})
    let offers =  await offersTable.find({})
        
    
    if(offers == null){
        offers = []
    }

    data['offers'] = offers

    data['current_url'] = '/admin/offer-list'
    
    //let data = {offers:offers,current_url:'offer-list'};

    return {statusCode:200, data:data}
  
    
}


exports.upload_savedb = async function(data) { 

    
    
    
                
                
        let qry_set = {}
        qry_set[data.uploadkey] = `${config.kRootUrl}/uploads/${data.username}/${data.filename}`
        
        await productsTable.update({
            createdby:data.username,
            guid:data.guid},{$set:qry_set})
            console.log(`718: exports.upload`)

        
    
    console.log(`727: exports.upload`)


        //console.log(`746: exports.upload`)
        //return {statusCode:200}
}



