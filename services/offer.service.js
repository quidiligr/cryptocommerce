const config = require('../config/config')
const monk = require('monk')

const db = monk(config.kMongoDb)

const orderTable = db.get('orders');
const orderDetailsTable = db.get('orderdetails');
const accountsTable = db.get('accounts');
const productsTable = db.get('products');
const offersTable = db.get('offers');


const CommonService = require('../services/common.service')   


exports.submit = async (req_session,req_body) =>{
    //router.post('/success', function(req, res, next) { 

        
    
        console.log(`68.1: START offer.service success req_body= ${JSON.stringify(req_body,null,4)}`)
        console.log(`68.2: req_session= ${JSON.stringify(req_session,null,4)}`)
      try{
        
        let basic_data = await CommonService.get_basic_data(req_session)
      
        
       
       if(basic_data.statusCode != 200 ){
           console.log('68.3 get_basic_data statusCode NOT 200!!!')
           return {statusCode:500}
       }

       let data = basic_data.data

       let product = await  productsTable.findOne({id: req_body.product_id})
        if (product == null){
        console.log(`38: product id ${req_body.id} does not exists!`)
            
            return {statusCode:500}
        }

        if(product['currency'] == null){
            product['currency'] = '$'
            await productsTable.update({id: product.id},{$set:{currency:'$'}})
        }
        let now = Date.now()

        let created = new Date(now)
        let offer_amount = req_body['offer_amount'] ? parseFloat(req_body['offer_amount']):0.0
        let offer = {
            id: now,
            created: created, 
            created_str: created.toISOString(),
            customer: data.user.username,
            vendor:   product.createdby,          
            product_id: product.id,
            product_price: {
                amount:product.price,
                currency:product.currency,
                amount_eth:data.eth * product.price
            },
            product_name: product.name,
            product_photo: product.upload1,
            message: req_body['offer_message'],
            offer:{
                amount:offer_amount,
                currency: product.currency,
                amount_eth:data.eth * offer_amount
            },

            status: '',
            decline_message: ''
        }

        await offersTable.insert(offer)
        data['offer'] = offer

        return {statusCode:200,data}
                    
        }
        catch(error){
            console.log(`error= ${JSON.stringify(error.stack,null,4)}`)
            

        }
                
        return {statusCode:500}
            
                
           // res.render('cart/thanks', data);
}



exports.tracking = async function(req_session,req_params) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`355: START offer.service.js tracking(req_session=${JSON.stringify(req_session,null,4)}, req_params=${JSON.stringify(req_params,null,4)}`)
    
    
    
    //let username = req_session.user.username
    

    
    
    

    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        console.log(`369: order.service.js statusCode != 200!!!`)
        return {statusCode:500}
    }

    let data = basic_data.data

    let qry_find= {id:req_params.id,username:req_session.user.username}
    console.log(`376: order.service.js qry_find= ${JSON.stringify(qry_find,null,4)}`)

    let order = await orderTable.findOne(qry_find)

    if(order && order.id){
        console.log(`378: order.service.js`)
    //data['categories'] = basic_data.categories
    //data['menu_categories'] = basic_data.menu_categories
    data['current_url'] = '/order/tracking' 
    data['order'] = order


    console.log(`385: order.service.js data=${JSON.stringify(data,null,4)}`)
    
    
    /*
    is_published:false,
                is_onsale: false,
                is_dealoftheday:false,
                is_new:true,
                */

    
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})
        
    
    
    
    return {statusCode:200,data:data}
    }
    else{
        console.log(`406: order.service.js statusCode 501!!!`)
        return {statusCode:501}
    }
    
}
            