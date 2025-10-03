const config = require('../config/config')
const monk = require('monk')

const db = monk(config.kMongoDb)
const accountTable = db.get('accounts')
const  categoryTable = db.get('categories'); 
const  brandTable = db.get('brands');    
const  productTable = db.get('products');
const  settingTable = db.get('settings'); 





const orderTable = db.get('orders');
const orderDetailsTable = db.get('orderdetails');

const CommonService = require('../services/common.service')   

exports.index = async function(req_session) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`17: START cart.service.js index(req_session=${JSON.stringify(req_session,null,4)}`)
    
    
    
    //let username = req_session.user.username
    

    
    
    

    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        
        return {statusCode:500}
    }

    let data = basic_data.data
    
    //data['categories'] = basic_data.categories
    //data['menu_categories'] = basic_data.menu_categories
    data['current_url'] = '/cart' 
    
    
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

exports.add = async function(req_session,req_params){

    
    let results = []
        
    let categories = await categoryTable.find({status: true})

    let brands = await brandTable.find({status: true})

    //let cart = {}
    let settings  = {}
    
    let product = await productTable.findOne({id: req_params.id},{id:1,guid:1,name:1,price:1,upload1:1})
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
            //cart = req.session.cart
            
        }
    }

    var count = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = 0;
    var items = []
    if(req.session.cart.length > 0){
        for( item of req_session.cart) { 
            sum += item.product.price * item.quantity
            items.push(item)
            
         }
        }
    let cart = {count:count, sum:sum,items: items}
               /* 
    let html = `<div><img src="/assets/images/icon/cart.png" class="img-fluid blur-up lazyload" alt=""> <i class="ti-shopping-cart"></i></div>
    <span class="cart_qty_cls">${cart.length}</span>
    <ul class="show-div shopping-cart">`

    let html_li1 = ''
    let html_li2 = ''
    if(cart.count > 0) {
            for (item of cart.items) {
            
                html += `<li>
            <div class="media">
                <a href="#"><img alt="" class="me-3"
                        src="${item.product.upload1}"></a>
                <div class="media-body">
                    <a href="#">
                        <h4><%= ${item.product.name} %></h4>
                    </a>
                    <h4><span><%= ${item.quantity} x ${item.product.currency == null ? '$': item.product.currency}${item.product.price}</span></h4>
                </div>
            </div>
            <div class="close-circle"><a href="#"><i class="fa fa-times"
                        aria-hidden="true"></i></a></div>
            
        </li>`
            }
            html += `<li>
            <div class="total">
                <h5>subtotal : <span>${cart.sum}</span></h5>
            </div>
        </li>
        <li>
            <div class="buttons"><a href="/cart/" class="view-cart">view
                    cart</a> <a href="#" class="checkout">checkout</a></div>
        </li>`
        } else {
            html += `<div class="view-cart">Your cart is empty cart.</div>`

        } 

        html += '</ul>'
        */
       
    settings = settingTable.find({group: 'paypal'})
       
 
    var data = {cart: cart, settings: settings};

    return data
  
    
}

exports.checkout = async function(req_session) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`17: START cart.service.js checkout(req_session=${JSON.stringify(req_session,null,4)}`)
    
    
    
    //let username = req_session.user.username
    

    
    
    

    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        
        return {statusCode:500}
    }

    let data = basic_data.data
    
    //data['categories'] = basic_data.categories
    //data['menu_categories'] = basic_data.menu_categories
    data['current_url'] = '/checkout' 
    
    
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



            