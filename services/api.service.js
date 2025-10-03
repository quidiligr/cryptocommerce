//const  express = require('express');
//const  router = express.Router();
//const crypto = require('crypto')
const config = require('../config/config')

const monk = require('monk');
const db = monk(config.kMongoDb)
const accountTable = db.get('accounts')
const  categoryTable = db.get('categories'); 
const  brandTable = db.get('brands');    
const  productTable = db.get('products');
const  settingTable = db.get('settings'); 

const CommonService = require('../services/common.service')   
const MyAccountService = require('../services/myaccount.service')
const ordersTable = db.get('orders');
const orderdetailsTable = db.get('orderdetails');
const offersTable = db.get('offers')


exports.cart_index = async function(req_session,req_params) { 
   
    console.log(`322: START cart.service.js exports.product_page req_params=${JSON.stringify(req_params,null,4)}`)
    
    
    
    let username = req_session.user.username
    

    if(req_params == null || req_params["id"] == null){
    
       
        console.log(`Product id is missing!`)
        return {statusCode:500}
        
        
    } 
    let id = req_params.id

    let qry = {id:id}
    console.log(`202: Product qry = ${JSON.stringify(qry,null,4)}`)
    
    let existing_product = await CommonService.get_product_by_id(id)
    
    
    if(existing_product.statusCode != 200){
        
        //console.log(`324: Product ${id} DOES NOT exists!`)
        return {statusCode:500}
    }

    existing_product = existing_product.data



    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        
        return {statusCode:500}
    }

    let data = basic_data.data
    
    //data['categories'] = basic_data.categories
    //data['menu_categories'] = basic_data.menu_categories
    data['current_url'] = '/cart' 
    
    
        
    data['product'] = existing_product

    
    return {statusCode:200,data:data}
    
    
}

exports.cart_add = async function(req_session,req_body){
    console.log('75: START exports.cart_add(')
console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
console.log(`75: req_session = ${JSON.stringify(req_body,null,4)}`)
console.log(')')

    let results = []
        
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})

    //let cart = {}
    let settings  = {}
    
    //let product = await  productTable.findOne({id: req_body.id},{id:1,guid:1,name:1,price:1,upload1:1,currency:1})
    let product = await  productTable.findOne({id: req_body.id},{id:1,guid:1,name:1,price:1,upload1:1})
    if (product && product['id'] != null ){
        if(req_session.cart == null) {
            req_session.cart = [{product: product, quantity: 1}];
        } 
        else {
            var index = -1;
            for(var i = 0; i < req_session.cart.length; i++) {
                if(req_session.cart[i].product.id == product.id) {
                    index = i;
                    break;
                }
            }
            if(index == -1) {
                req_session.cart.push({
                    product: product, quantity: 1
                });
            } else {
                req_session.cart[index].quantity++;
            }
            //cart = req.session.cart
            
        }
    }

    else{
        return {statusCode:500}
    }

    let currency = await CommonService.get_mycurrency(req_session)

    let eth = await CommonService.get_eth_rates(currency)

    console.log(`237: common.service get_basic_data eth= ${JSON.stringify(eth,null,4)}`)

    if(eth.statusCode != 200){
        return {statusCode:eth.statusCode }
    }

    eth = eth.data
    //let currency_matched = false
    
    let cart = await CommonService.get_cart_data(req_session,currency,eth)

    //let cart = await CommonService.get_cart_data(req_session)
    if(cart.statusCode != 200){
        return `<p>There was an error processing your request. Please try again later.</p>`
    }

    /*
    {
        
            items:items, 
            count:count, 
            currency: currency,
            sum:sum, 
    }
    */
    cart = cart.data
/*
    let eth = await CommonService.get_eth_rates(req_session)

    if(eth.statusCode != 200){
        
        return {statusCode:500}
    }

    eth = eth.data

    var count = req_session.cart == null ? 0 : req_session.cart.length;
    
    var items = []
    let currency = config.default_currency

    var sum = {amount:0,currency:currency,eth:{amount:0.0}}

    if(req_session.cart.length > 0){
        for( var item of req_session.cart) { 

            sum.amount += item.product.price.amount * item.quantity
            items.push(item)

         }
         sum.eth.amount = sum.amount * eth

    }
    let cart = {count:count,currency:currency, sum:sum,items: items}
*/
    console.log(`154: exports.cart_add cart= ${JSON.stringify(cart,null,4)} `)
                
let html = 
`<div><img src="/assets/images/icon/cart.png" class="img-fluid blur-up lazyload" alt=""> <i class="ti-shopping-cart"></i></div>
<span class="cart_qty_cls">${cart.items.length}</span>
<ul class="show-div shopping-cart">`

    let html_li1 = ''
    let html_li2 = ''
    let item_index = 0
    if(cart.count > 0) {
            for (item of cart.items) {
                
html += 
`<li>
<div class="media">
<a href="#"><img alt="" class="me-3"
        src="${item.product.upload1}"></a>
<div class="media-body">
    <a href="#">
        <h4>${item.product.name}</h4>
    </a>
    <h4><span>${item.quantity} x ${item.product.price.currency.symbol}${item.product.price.amount}</span></h4>
</div>
</div>
<div class="close-circle"><a href="#" onclick="removeFromCart(${item_index})"><i class="fa fa-times"
        aria-hidden="true"></i></a></div>

</li>`
item_index++
            
}
html += `<li>
<div class="total">
    <h5>subtotal : <span>${cart.sum.currency.symbol}${cart.sum.amount}</span><p><span>≈${cart.sum.eth.amount.toFixed(6)} ETH</span></p></h5>
</div>
</li>
<li>
<div class="buttons"><a href="/cart" class="view-cart">view
        cart</a> <a href="/order/checkout" class="checkout">checkout</a></div>
</li>`
} else {
html += `<div class="view-cart">Your cart is empty cart.</div>`

} 

html += '</ul>'
       
    settings = settingTable.find({group: 'paypal'})
       
 
    var data = {cart: cart, settings: settings,html:html};

    console.log(`75: END exports.cart_add data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}


exports.cart_removeitem = async function(req_session,req_body){
    console.log('75: START exports.cart_removeitem(')
console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
console.log(`75: req_session = ${JSON.stringify(req_body,null,4)}`)
console.log(')')

    let results = []
        
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})

    //let cart = {}
    let settings  = {}
    
    if(req_session.cart != null) {
        const p_index = parseInt(req_body.index);
        req_session.cart.splice(p_index, 1);
    }

    
    let eth = await CommonService.get_eth_rates(req_session)

    if(eth.statusCode != 200){
        
        return {statusCode:500}
    }

    eth = eth.data

    var count = req_session.cart == null ? 0 : req_session.cart.length;
    var sum = {amount:0.0,currency:config.default_currency,eth:0.0};
    var items = []
    if(req_session.cart.length > 0){
        for( var item of req_session.cart) { 
            sum.amount += item.product.price.amount * item.quantity
            items.push(item)
            
         }
         sum.eth= {amount:sum.amount * eth}
    }
    //let cart = {count:count, sum:sum,items: items, sum_eth: sum * eth}

    let cart = {count:count, sum:sum,items: items}
                
let html = 
`<div><img src="/assets/images/icon/cart.png" class="img-fluid blur-up lazyload" alt=""> <i class="ti-shopping-cart"></i></div>
<span class="cart_qty_cls">${cart.items.length}</span>
<ul class="show-div shopping-cart">`

    let html_li1 = ''
    let html_li2 = ''
    let item_index = 0
    if(cart.count > 0) {
            for (item of cart.items) {
            
html += 
`<li>
<div class="media">
<a href="#"><img alt="" class="me-3"
        src="${item.product.upload1}"></a>
<div class="media-body">
    <a href="#">
        <h4>${item.product.name}</h4>
    </a>
    <h4><span>${item.quantity} x ${item.product.currency == null ? '$': item.product.currency}${item.product.price}</span></h4>
</div>
</div>
<div class="close-circle"><a href="#" onclick="removeFromCart(${item_index})"><i class="fa fa-times"
        aria-hidden="true"></i></a></div>

</li>`

item_index++

}
html += `<li>
<div class="total">
    <h5>subtotal : <span>$${cart.sum}</span><span>${cart.sum_eth} ETH</span></h5>
</div>
</li>
<li>
<div class="buttons"><a href="/cart" class="view-cart">view
        cart</a> <a href="/cart/checkout" class="checkout">checkout</a></div>
</li>`
} else {
html += `<div class="view-cart">Your cart is empty cart.</div>`

} 

html += '</ul>'
       
    settings = settingTable.find({group: 'paypal'})
       
 
    var data = {cart: cart, settings: settings,html:html};

    console.log(`75: END exports.cart_add data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}


exports.quickview = async function(req_session,req_body){
    console.log('75: START quickview(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
    console.log(`75: req_session = ${JSON.stringify(req_body,null,4)}`)
    console.log(')')

    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    }    

    
    let product = await  productTable.findOne({id: req_body.id},{id:1,guid:1,name:1,price:1,upload1:1,currency:1})
    if (product == null){
       console.log(`318: product id ${req_body.id} does not exists!`)
        
        return {statusCode:500}
    }

    let eth = await CommonService.get_eth_rates(req_session)

    let ret_product = {}
    ret_product['name'] = product.name
    ret_product['photo'] = product.upload1
    //ret_product['price'] = product.price
    ret_product['price'] =  product.price //{amount:product.price,currency:'$'}
    
    
    if(product.editor1){
        ret_product['desc'] = product.editor1
    }
    else{
        ret_product['desc'] = ''
    }
    
    if(eth.statusCode != 200){
        
        console.log(`318: eth is invalid!`)
        
        //ret_product['price_eth'] = 0.0
        ret_product.price['eth'] = 0.0
    }
    else{
        
       // ret_product['price_eth'] = product.price.amount * eth.data
       ret_product.price['eth'] = product.price.amount * eth.data
    }

        
    var data = {product: ret_product};

    console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.makeoffer = async function(req_session,req_body){
    console.log('75: START makeoffer(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
    console.log(`75: req_session = ${JSON.stringify(req_body,null,4)}`)
    console.log(')')

    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    }    


    
    let product = await  productTable.findOne({id: req_body.id},{id:1,guid:1,name:1,price:1,upload1:1,currency:1})
    if (product == null){
       console.log(`318: product id ${req_body.id} does not exists!`)
        
        return {statusCode:500}
    }

    let eth = await CommonService.get_eth_rates(req_session)

    let ret_product = {}
    ret_product['name'] = product.name
    ret_product['photo'] = product.upload1
    //ret_product['price'] = product.price
    ret_product['price'] = product.price//{amount:product.price,currency:'$'}
    
    
    if(product.editor1){
        ret_product['desc'] = product.editor1
    }
    else{
        ret_product['desc'] = ''
    }
    
    if(eth.statusCode != 200){
        
        console.log(`318: eth is invalid!`)
        
        //ret_product['price_eth'] = 0.0
        ret_product.price['eth']  = 0.0
    }
    else{
        
        //ret_product['price_eth'] = product.price.amount * eth.data
        ret_product.price['eth'] = product.price.amount * eth.data
    }



        
    var data = {product: ret_product};

    console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}


exports.place_order = async (req_session,req_body) =>{
    //router.post('/success', function(req, res, next) { 

        
    
        console.log(`185: START POST /success req_body= ${JSON.stringify(req_body,null,4)}`)
        console.log(`185: req_session= ${JSON.stringify(req_session,null,4)}`)
      
        let data = CommonService.get_basic_data(req_session)
        /*
        let data = {
        categories: categories, 
        menu_categories: menu_categories, 
        cart:{
            items:items, 
            count:count, 
            sum:sum, 
            sum_eth: sum * eth  },
        user:req_session.user,
        eth:eth,
        seller_wallet: '0x3Ad54CcC9AD0FE8b6bA9168D59C7fB36e220571D'
        
        
        //brands: brands, 
    
    }
        */

       if(data.statusCode != 200 ){
           return {statusCode:500}
       }

       data = data.data


       /*
        let transaction_hash_str = req_body['transaction_hash'] != null ? req_body['transaction_hash'] : ''

        if(transaction_hash_str.length == 0){
            console.log('Invalid transaction_hash_str.')
            return {statusCode: 500}
        }
        */
        
        let id = Date.now()
        
        
        //let transaction_hash = JSON.parse(transaction_hash_str)
/*
        let eth_exchange_now =  CommonService.get_eth_rates()
        
        if(eth_exchange_now.statusCode != 200){
            eth_exchange_now = eth_exchange_now.data
        }
        let eth_exchange = req_body['eth_exchange'] != null ? parseFloat(req_body['eth_exchange']) : eth_exchange_now
*/

        try{
                await orderTable.insert({
                id: id,//req.query.tx, 
                created: new Date().toLocaleDateString(), 
                username: req.session.user.username, 
                buyer: req.session.user.username, 
                //seller : seller,
                status: 'waiting payment',
                buyer_wallet:  '',//req_body['buyer_wallet'] != null ? req_body['buyer_wallet'] : '', 
                //seller_wallet:  data.seller_wallet,//req_body['seller_wallet'] != null ? req_body['seller_wallet'] : '',
                amount: data.sum, //req_body['sum_eth'] != null ? parseFloat(req_body['sum_eth']) : 0.0,
                amount_eth: data.sum_eth,
                transaction_hash_str: '',//transaction_hash_str,
                transaction_hash: '',//transaction_hash,
                eth_exchange: data.eth,

            })
            
            let orderdetails = [];
            /*
                for(var i = 0; i < req.session.cart.length; i++) {
                    orderdetails.push({
                        orderId: i+1,//req.query.tx,
                        productId: req.session.cart[i].product.id,
                        price: req.session.cart[i].product.price,
                        //quantity: req.session.cart[i].product.quantity
                        quantity: req.session.cart[i].quantity
                    });
                    
                }
                */
               /*
               <th scope="col">image</th>
                                                            <th scope="col">Order Id</th>
                                                            <th scope="col">Product Details</th>
                                                            <th scope="col">Status</th>
                                                            <th scope="col">Price</th>
                                                            <th scope="col">View</th>
               */
                for(var i = 0; i < data.cart.items.length; i++) {
                    orderdetails.push({
                        order_id: i+1,//req.query.tx,
                        product_id: data.cart.items[i].product.id,
                        product_name: data.cart.items[i].product.name,
                        seller: data.cart.items[i].product.createdby,
                        price: data.cart.items[i].product.price,
                        price_eth: data.cart.items[i].product * data.eth,
                        
                        
                        //quantity: req.session.cart[i].product.quantity
                        quantity: req.session.cart[i].quantity,
                        seller: product.createdby
                    });
                    
                }
                await orderDetailsTable.insert(orderdetails)
                    // Remove cart
                    delete req.session.cart;

                    delete data.cart
                    
                    
        }
        catch(error){
            console.log(`error= ${error}`)
            return {statusCode:500}

        }
                
            /*
            let hash =  transaction_hash
                let transact = {
                    'Block Hash': hash['blockHash'],
                    'Block Number': hash['blockNumber'],
                    'Gas Price': hash['effectiveGasPrice'],
                    'Gas Used': hash['gasUsed'],
                    'Buyer Wallet': hash['from'],
                    'Seller Wallet': hash['to'],
                    'Transaction Hash': hash['transactionHash'],
                    
                    
                }
                data['transact'] = transact
*/
                return {statusCode:200,data}
           // res.render('cart/thanks', data);
}

exports.getMyWallets = async function(req_session,req_body){
    console.log('75: START mywallets(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   

    let account = await accountTable.findOne({username: req_session.user.username})
    if(account.wallets == null){
        account.wallets = []
    }

    html =''
    let rows=''
    if(account.wallets.length > 0){

        
        for(w of account.wallets){
            
            let checked = w.is_default ? `checked="checked"` : ''
            let radio_option = `<input type="radio" name="wallet-group" ${checked}>`

            let row = `<div class="select-box ${w.is_default?'active':''} col-xl-4 col-md-6">
                    <div class="address-box">
                        
                        <div class="card-number">
                            <h6>Wallet address</h6>
                            <h5>${w.address}</h5>
                            <div class="radio-option">
                                ${radio_option}
                                    
                            </div>
                        </div>
                    
                        
                        <div class="bottom">
                            <a href="/myaccount/edit-wallet/${w.id}"
                                    class="bottom_btn">edit</a>
                            <a href="/myaccount/remove-wallet/${w.id}" class="bottom_btn">remove</a>
                        </div>
                    </div>
                </div>`
            rows = `${rows}${row}`
        }
    }
    else{
        rows = "You currently have no crypto wallets. Click the 'Add' button to create one now. A crypto wallet is required to receive payouts as a seller."
    }
    
    html=
    `<div class="row">
        <div class="col-12">
            <div class="card mt-0">
                <div class="card-body">
                    <div class="top-sec">
                        <h3>Wallets</h3>
                        
                        <a href="/myaccount/add-wallet" class="btn btn-sm btn-solid">+ add new</a>
                    </div>
                    <div class="address-book-section">
                        <div class="row g-4">
                        ${rows}    
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
        
   // var data = {wallets: account.wallets};
   var data = {html:html}

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.removeWallet = async function(req_session,req_body){
    console.log('75: START mywallet_remove(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
    
    console.log(')')

    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   
/*
    let account = await accountTable.findOne({username: req_session.user.username})

    if(account.wallets == null){
        account.wallets = []
    }
    */

    await accountTable.update({username:req_session.user.username},{$pull:{'wallets':{address:req_body.wallet_address}}})

    
    let account = await accountTable.findOne({username:req_session.user.username})
        
    var data = {wallets: account.wallets};

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}



exports.postEditwallet = async function(req_session,req_body){
    console.log('75: START mywallet_edit(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
   
    console.log(')')

    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   

    /*
    let account = await accountTable.findOne({username: req_session.user.username})
    if(account.wallets == null){
        account.wallets = []
    }
    */
   //let account = await accountTable.findOne({username:req_session.username})
   let account = await CommonService.getAccount(req_session.username)
   if(account && account.wallets){
        for(w of account.wallets){
            if(w.id == req_body.id){
                w.address = req_body.wallet_adddress
                w.is_default = req_body.is_default
            }
        }
   }
   await accountTable.update({username:req_session.user.username},{$set:{wallets:account.wallets}})
    
    var data = {wallets: account.wallets};

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.getMyProducts = async function(req_session,req_body){
    console.log('778: START getMyProducts(')
    console.log(`779: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    try{

    
    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   
   let username = req_session.user.username
/*
    let account = await accountTable.findOne({username: req_session.user.username})
    if(account.wallets == null){
        account.wallets = []
    }
    */
    let summary ={total_orders:0,total_pending_orders:0,total_offers:0,total_pending_offers:0}

    let products = await productTable.find({createdby: username})

    

    let html = ''

    if (products == null){
        products = []
    } 
    else{
        summary.total_products = products.length
        /*for(x of orders){
            if(x.status == 0){
                summary.total_pending_orders = summary.total_pending_orders + 1

            }

        }*/
        let categories = await CommonService.get_categories()
        categories = categories.data.categories

        let trs = ''
        for(p of products){
            let qry_set = {}
            if(p['stock'] == null){

                p['stock'] = {count:0,unlimited:false}
                qry_set['stock'] = p.stock
            }
            if(p['sales'] == null){

                p['sales'] = {count:0}
                qry_set['sales'] = p.sales
            }
            if(p['returns'] == null){

                p['returns'] = {count:0}
                qry_set['returns'] = p.returns
            }
            
            if(Object.keys(qry_set).length > 0){
                await productTable.update({id:p.id},{$set:qry_set})
            }
            

            let cat = categories.find(({id}) => id === p.categoryId)
            let tr = `<tr>
            <th scope="row"><img
                    src="${p.upload1}"
                    class="blur-up lazyloaded"></th>
            <td>${p.name}</td>
            <td>${cat ? cat.name : ''}</td>
            <td class="fw-bold text-theme">${p.price.currency.symbol}${p.price.amount}</td>
            <td>${p.stock.count}</td>
            <td>${p.sales.count}</td>
            <td>
                <a href="javascript:void(0)" onclick="location.href='/vendor/edit-product-page/${p.guid}';"><i class="fa fa-pencil-square-o me-1"
                        aria-hidden="true"></i>
                    <a href="javascript:void(0)" onclick="removeProduct('${p.guid}')"><i
                        class="fa fa-trash-o ms-1 text-theme"
                        aria-hidden="true"></i></a>
            </td>
        </tr>`
            trs = `${trs}${tr}`

        }
        

        let table = 
        `<table class="table mb-0 product-table">
            <thead>
                <tr>
                    <th scope="col">image</th>
                    <th scope="col">product name</th>
                    <th scope="col">category</th>
                    <th scope="col">price</th>
                    <th scope="col">stock</th>
                    <th scope="col">sales</th>
                    <th scope="col">edit/delete</th>
                </tr>
            </thead>
            <tbody>
                ${trs}
            </tbody>
        </table>`

        html = 
        `<div class="row">
            <div class="col-12">
                <div class="card dashboard-table mt-0">
                    <div class="card-body">
                        <div class="top-sec">
                            <h3>all products</h3>
                            <a href="javascript:void(0)" onclick="addProduct()" class="btn btn-sm btn-solid">+ add new</a>
                        </div>
                        <div class="table-responsive-md">
                            ${table}    
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }

    
        
    var data = {html: html}

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
    }
    catch(ex){
        console.log(`915: ex=${ex.stack}`)
    }  

    console.log({statusCode:500,error:{message:config.error_processing}})
    
}


exports.getMyOrders = async function(req_session,req_body){
    console.log('75: START getMyOrders(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   
   let username = req_session.user.username
/*
    let account = await accountTable.findOne({username: req_session.user.username})
    if(account.wallets == null){
        account.wallets = []
    }
    */
    let summary ={total_orders:0,total_pending_orders:0,total_offers:0,total_pending_offers:0}

    let orders = await orderdetailsTable.find({username: username})

    let html = ''

    if (orders == null){
        orders = []
    } 
    else{
        summary.total_orders = orders.length
        for(x of orders){
            if(x.status == 0){
                summary.total_pending_orders = summary.total_pending_orders + 1

            }

        }

        let trs = ''
        for(item of orders){
            let tr = `<tr>
            <td>
                <a href="javascript:void(0)">
                    <img src="${item.photo}"
                        class="blur-up lazyloaded" alt="">
                </a>
            </td>
            <td>
                <span class="mt-0">${item.id}</span>
            </td>
            <td>
                <span class="fs-6">${item.name}</span>
            </td>
            <td>
                <span
                    class="badge rounded-pill bg-success custom-badge">${item.shipping.status}</span>
            </td>
            <td>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6">${item.price.currency.symbol} ${item.price.amount}</span>
                
                </p>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6" style="font-style: italic;">≈${item.price.eth.amount.toFixed(6)} ETH</span>
               
                </p>
    
            </td>
            <td>
                <a href="javascript:void(0)">
                    
                    <i class="fa fa-user text-theme"></i>
                    ${item.seller}
                </a>
            </td>
            <!--
            <td>
                <a href="javascript:void(0)">
                    <i class="fa fa-eye text-theme"></i>
                </a>
            </td>
            -->
        </tr>`
            trs = `${trs}${tr}`

        }
        

        let table = `<table class="table cart-table order-table">
        <thead>
            <tr class="table-head">
                <th scope="col">image</th>
                <th scope="col">Order Id</th>
                <th scope="col">Product Details</th>
                <th scope="col">Status</th>
                <th scope="col">Price</th>
                <th scope="col">Seller</th>
            </tr>
        </thead>
        <tbody>
            ${trs}
        </tbody>
    </table>`

        html = 
        `<div class="row">
            <div class="col-12">
                <div class="card dashboard-table mt-0">
                    <div class="card-body table-responsive-sm">
                        <div class="top-sec">
                            <h3>My Orders</h3>
                        </div>
                        <div class="table-responsive-xl">
                            ${table}    
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }

    
        
    var data = {html: html}

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.getSaleOrders = async function(req_session,req_body){
    console.log('75: START getSaleOrders(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   
   let username = req_session.user.username
/*
    let account = await accountTable.findOne({username: req_session.user.username})
    if(account.wallets == null){
        account.wallets = []
    }
    */
    let summary ={total_orders:0,total_pending_orders:0,total_orders_sale:0,total_pending_orders_sale:0,total_offers:0,total_pending_offers:0}

    let orders_sale = await orderdetailsTable.find({seller: username})

    let html = ''

    if (orders_sale == null){
        orders_sale = []
    } 
    else{
        summary.total_orders_sale = orders_sale.length
        for(x of orders_sale){
            if(x.status == 0){
                summary.total_pending_orders_sale = summary.total_pending_orders_sale + 1

            }

        }

        let trs = ''
        for(item of orders_sale){
            let tr = `<tr>
            <td>
                <a href="javascript:void(0)">
                    <img src="${item.photo}"
                        class="blur-up lazyloaded" alt="">
                </a>
            </td>
            <td>
                <span class="mt-0">${item.id}</span>
            </td>
            <td>
                <span class="fs-6">${item.name}</span>
            </td>
            <td>
            <spanclass="badge rounded-pill bg-success custom-badge">${item.order_status}</span>
                
                
            </td>
            <td>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6">${item.price.currency.symbol} ${item.price.amount}</span>
                
                </p>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6" style="font-style: italic;">≈${item.price.eth.amount.toFixed(6)} ETH</span>
               
                </p>
    
            </td>
            <td>
                <a href="javascript:void(0)">
                    
                    <i class="fa fa-user text-theme"></i>
                    ${item.username}
                </a>
            </td>
            
            <td>
                
            <a href="/order/tracking/${item.order_id}">
                <i class="fa fa-pencil text-theme"></i>
                </a>
            </td>
            
        </tr>`
            trs = `${trs}${tr}`

        }
        

        let table = `<table class="table cart-table order-table">
        <thead>
            <tr class="table-head">
                <th scope="col">image</th>
                <th scope="col">Order Id</th>
                <th scope="col">Product Details</th>
                <th scope="col">Status</th>
                <th scope="col">Price</th>
                <th scope="col">Buyer</th>
                
            </tr>
        </thead>
        <tbody>
            ${trs}
        </tbody>
    </table>`

        html = 
        `<div class="row">
            <div class="col-12">
                <div class="card dashboard-table mt-0">
                    <div class="card-body table-responsive-sm">
                        <div class="top-sec">
                            <h3>Orders (Sales)</h3>
                        </div>
                        <div class="table-responsive-xl">
                            ${table}    
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }

    
        
    var data = {html: html}

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.getPayouts = async function(req_session,req_body){
    console.log('75: START getPayouts(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   
   let username = req_session.user.username
/*
    let account = await accountTable.findOne({username: req_session.user.username})
    if(account.wallets == null){
        account.wallets = []
    }
    */
    let summary ={
        total_orders:0,
        total_pending_orders:0,
        total_orders_sale:0,
        total_pending_orders_sale:0,

        total_offers:0,
        total_pending_offers:0}
    
    let is_admin = req_session.user.is_admin != null ? req_session.user.is_admin : false

    if(is_admin){
        summary['total_payouts'] = 0
        summary['total_pending_payouts'] = 0

        //100:pay 101:paying 102:paid 200: shipped 201:delivered/received 300:payoutdone 
        //failure -101:pay -201:delivery 
        //summary['total_payouts'] = await orderdetailsTable.find({status:{$in:[201,300]}}) 
        //summary['total_pending_payouts'] = await orderdetailsTable.find({status: 201}) 
        /*

        let sum_payouts = await orderdetailsTable.aggregate[
            {$match:{status:{$in:[201,300]}}}, //delivered,payout
            {"$group": {_id:'$status'}, count:{$sum:1}},
            {$sort:{"_id":-1}}
        ]

        if(sum_payouts && sum_payouts.length > 0){
            for(x of sum_payouts){
                if(x._id == 300){
                    summary['total_payouts'] = x.count
            
                }
                if(x._id == 201){
                    summary['total_pending_payouts'] = x.count
            
                }
                
            }
        }
        */

        


    }


    let payouts = await orderdetailsTable.find({'payout.status': {$in:['PENDING','COMPLETED']}} )//1:pending 2: completed)

    let html = ''

    if (payouts == null){
        payouts = []
    } 
    else{
        summary.total_payouts = payouts.length
        for(x of payouts){
            if(x.payout.status == 'COMPLETED'){
                summary.total_pending_payouts = summary.total_pending_payouts + 1

            }

        }

        let trs = ''
        for(item of payouts){
            let tr = `<tr>
            <td>
                <a href="javascript:void(0)">
                    <img src="${item.photo}"
                        class="blur-up lazyloaded" alt="">
                </a>
            </td>
            <td>
                <span class="mt-0">${item.id}</span>
            </td>
            <td>
                <span class="fs-6">${item.name}</span>
            </td>
           
            <td>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6">${item.price.currency.symbol} ${item.price.amount}</span>
                
                </p>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6" style="font-style: italic;">≈${item.price.eth.amount.toFixed(6)} ETH</span>
               
                </p>
    
            </td>
            <td><a href="javascript:void(0)"><i class="fa fa-user text-theme"></i>${item.username}</a>
            </td>
            <td>
                <a href="javascript:void(0)"><i class="fa fa-user text-theme"></i>${item.seller}</a>
            </td>
            <td>
                <span class="badge rounded-pill bg-success custom-badge">${item.shipping.status}</span>
            </td>
            <td>
                <span class="badge rounded-pill bg-success custom-badge">${item.payment.status}</span>
            </td>
            <td>
                <span class="badge rounded-pill bg-success custom-badge">${item.payout.status}</span>
            </td>
            
        </tr>`
            trs = `${trs}${tr}`

        }
        

        let table = `<table class="table cart-table order-table">
        <thead>
            <tr class="table-head">
                <th scope="col">image</th>
                <th scope="col">Order Id</th>
                <th scope="col">Product Details</th>
                <th scope="col">Price</th>
                <th scope="col">Buyer</th>
                <th scope="col">Seller</th>
                <th scope="col">Shipping</th>
                <th scope="col">Payment</th>
                <th scope="col">Payout</th>
                
            </tr>
        </thead>
        <tbody>
            ${trs}
        </tbody>
    </table>`

        html = 
        `<div class="row">
            <div class="col-12">
                <div class="card dashboard-table mt-0">
                    <div class="card-body table-responsive-sm">
                        <div class="top-sec">
                            <h3>Orders (Sales)</h3>
                        </div>
                        <div class="table-responsive-xl">
                            ${table}    
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }

    
        
    var data = {html: html}

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.getMyOffers = async function(req_session,req_body){
    console.log('75: START mywallets(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    /*
    if(req_body['id'] == null || req_body.id == ''){
        console.log(`308: req_body.id is invalid!`)
        return {statusCode:501}
    } 
    */   
   let username = req_session.user.username
/*
    let account = await accountTable.findOne({username: req_session.user.username})
    if(account.wallets == null){
        account.wallets = []
    }
    */
    let summary ={total_orders:0,total_pending_orders:0,total_offers:0,total_pending_offers:0}

    
    
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

    let html = ''
    if (offers == null){
        offers = []
    } 
    else{
        summary.total_offers = offers.length
        for(x of offers){
            if(x.status == 0){
                summary.total_pending_offers = summary.total_pending_offers + 1

            }

        }

        let trs = ''
        for(item of offers){
            let tr = `<tr>
            <td>
                <a href="javascript:void(0)">
                    <img src="${item.product_photo}"
                        class="blur-up lazyloaded" alt="">
                </a>
            </td>
            <td>
                <span class="mt-0">${item.id}</span>
            </td>
            <td>
                <span class="fs-6">${item.product_name}</span>
            </td>
            <td>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6">${item.product_price.currency.symbol}${item.product_price.amount}</span>
                
                </p>
                <p align="left" style="margin: 0;padding: 0;">
                    <span class="theme-color fs-6" style="font-style: italic;">≈${item.product_price.eth.amount.toFixed(6)} ETH</span>
               
                </p>
                
               
                 
            </td>
            <td>
                <p align="left" style="margin: 0;padding: 0;"><span class="theme-color fs-6">${item.offer.currency}${item.offer.amount}</span></p>
                <p align="left" style="margin: 0;padding: 0;"><span class="theme-color fs-6" style="font-style: italic;">${item.offer.amount_eth.toFixed(6)} ETH</span></p>
                 
            </td>
            <td>
                <span
                    class="badge rounded-pill bg-success custom-badge">${item.status}</span>
            </td>
           
            
        </tr>`
            trs = `${trs}${tr}`

        }
        

        let table = `<table class="table cart-table order-table">
        <thead>
            <tr class="table-head">
                <th scope="col">image</th>
                <th scope="col">Id</th>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Offer amount</th>
                <th scope="col">Status</th>
               
            </tr>
        </thead>
        <tbody>
            ${trs}
        </tbody>
    </table>`

        html = 
        `<div class="row">
            <div class="col-12">
                <div class="card dashboard-table mt-0">
                    <div class="card-body table-responsive-sm">
                        <div class="top-sec">
                            <h3>My Offers</h3>
                        </div>
                        <div class="table-responsive-xl">
                                ${table}    
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }

   
    
    
        
    var data = {html: html};

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.getMyInfo = async function(req_session,req_body){
    console.log('75: START getMyInfo(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    //let req_session = req.session
    /*let basic_data = await CommonService.get_basic_data(req_session)
    
    if(basic_data.statusCode != 200){
        return {statusCode:500}
    }

    let data = basic_data.data
*/

    //let categories = basic_data.categories //await categoryTable.find({status: true})

    //let menu_categories = basic_data.menu_categories //[]

    //let cart = basic_data.cart

    //let eth = basic_data.eth


    
    //let user =  data.user
    let username = req_session.user.username

    //if(user.username != 'guest' ){
        let account = await CommonService.getAccount(username)
        /*
        if(account['username']){
            //update userinfo if needed
            let query_set = {}
            */
            
           // data.user['name'] = account.name
            
            
            
            
            //if(data.user['userinfo'] == null){
               // data.user['userinfo'] = account.userinfo
                /*{
                 shipping_address: config.default_shipping_address,
                 billing_address: config.default_billing_address
                 */
             //}
             //query_set['userinfo'] = data.user.userinfo
             
            
            //if(data.user['phone'] == null){
               // data.user['phone'] =  account.phone
           // }

           // data.user['wallets'] = account.wallets
            /*
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
     
        let summary ={total_orders:0,total_pending_orders:0,total_orders_sale:0,total_pending_orders_sale:0, total_offers:0,total_pending_offers:0}

        //orders summary
    let orders = await orderdetailsTable.find({username: username})

    if (orders == null){
        orders = []
    } 


    
    //data['myorders'] = orders

    if(orders.length > 0 ){
        summary.total_orders = orders.length
        for(x of orders){
            if(x.status == 0){
                summary.total_pending_orders = summary.total_pending_orders + 1

            }

        }
    }

    //orders sale 
    let orders_sale = await orderdetailsTable.find({seller: username})

    if (orders_sale == null){
        orders_sale = []
    } 


    if(orders_sale.length > 0 ){
        summary.total_orders_sale = orders_sale.length
        for(x of orders_sale){
            if(x.status == 0){
                summary.total_pending_orders_sale = summary.total_pending_orders_sale + 1

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

   // data['myoffers'] = offers
   //data['summary'] = summary

    
   //let account = await CommonService.getAccount(username)


    let billing_address = `<address>You have not set a default billing address.<br><a href="/myaccount/edit-billing-address">Edit
    Address</a></address>`
    
    if(account.userinfo.billing_address.address) {
        billing_address= `<address>${account.userinfo.billing_address.address}<br><a href="/myaccount/edit-billing-address">Edit
        Address</a></address>`
    }

    let shipping_address = `<address>You have not set a default shipping address.<br><a href="/myaccount/edit-shipping-address">Edit
    Address</a></address>`
    
    if(account.userinfo.shipping_address.address) {
        shipping_address= `<address>${account.userinfo.shipping_address.address}<br><a href="/myaccount/edit-shipping-address">Edit
        Address</a></address>`
    }

    let html = `<div class="counter-section">
        <div class="welcome-msg">
            <h4>Hello, ${account.name} !</h4>
            <p>From your dashboard you have the ability to view a snapshot of your
                recent
                account activity and update your account information. Select a link below to
                view or
                edit information.</p>
        </div>
        <div class="row">
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/sale.png" class="img-fluid">
                    <div>
                        <h3>${summary.total_orders}</h3>
                        <h5>Total Orders</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/homework.png" class="img-fluid">
                    <div>
                        <h3>${summary.total_pending_orders}</h3>
                        <h5>Pending Orders</h5>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/sale.png" class="img-fluid">
                    <div>
                        <h3>${summary.total_orders_sale}</h3>
                        <h5>Total Orders (Sale)</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/homework.png" class="img-fluid">
                    <div>
                        <h3>${summary.total_pending_orders_sale}</h3>
                        <h5>Pending Orders (Sale)</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/order.png" class="img-fluid">
                    <div>
                        <h3>${summary.total_offers}</h3>
                        <h5>Total Offers</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/order.png" class="img-fluid">
                    <div>
                        <h3>${summary.total_pending_offers}</h3>
                        <h5>Pending Offers</h5>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-account box-info">
            <div class="box-head">
                <h4>Account Information</h4>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="box">
                        <div class="box-title">
                            <h3>Contact Information</h3>
                        </div>
                        <div class="box-content">
                            <h6>${account.name}</h6>
                            <h6>${account.email}</h6>
                            <h6><a href="/myaccount/change-password">Change Password</a></h6>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="box">
                        
                    </div>
                </div>
            </div>
            <div class="box mt-3">
                <!--
                <div class="box-title">
                    <h3>Address Book</h3><a href="#">Manage Addresses</a>
                </div>
                -->
                <div class="row">
                    <div class="col-sm-6">
                        <h6>Default Billing Address</h6>
                        
                        ${billing_address}

                    </div>
                    <div class="col-sm-6">
                        <h6>Default Shipping Address</h6>
                        ${shipping_address}
                    </div>
                </div>
            </div>
        </div>
    </div>`
    //}

    
        
    data = {html: html};

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.getMyBusinessProfile = async function(req_session,req_body){
    console.log('75: START mywallets(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    //let req_session = req.session
    //let basic_data = await CommonService.get_basic_data(req_session)
    
   // if(basic_data.statusCode != 200){
    //    return {statusCode:500}
    //}

    //let data = basic_data.data

    //let categories = basic_data.categories //await categoryTable.find({status: true})

    //let menu_categories = basic_data.menu_categories //[]

    //let cart = basic_data.cart

    //let eth = basic_data.eth


    
    //let user =  req_session.user
    let username = req_session.user.username

    //if(user.username != 'guest' ){
        let account = await CommonService.getAccount(username)
        /*
        if(account['username']){
            //update userinfo if needed
            let query_set = {}
            */
            //if(data.user['name'] == null){
               // data.user['name'] = account.name
             //query_set['name'] = data.user.name
           // }
 
            
            
            //if(data.user['userinfo'] == null){
                //data.user['companyinfo'] = account.companyinfo
                /*{
                 shipping_address: config.default_shipping_address,
                 billing_address: config.default_billing_address
                 */
           // }
             //query_set['userinfo'] = data.user.userinfo
             
            
            //if(data.user['phone'] == null){
           //     data.user['phone'] =  account.phone
           // }

          //  data.user['wallets'] = account.wallets
            /*
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
     
        
    
   //let account = await CommonService.getAccount(username)


    
    let html = ''
    
    
        

        html = `<div class="row">
        <div class="col-12">
            <div class="card mt-0">
                <div class="card-body">
                    <div class="dashboard-box">
                        <div class="dashboard-title">
                            <h4>Business/Company</h4>
                            <a class="edit-link" href="/myaccount/edit-company-info">edit</a>
                        </div>
                        <div class="dashboard-detail">
                            <ul>
                                <li>
                                    <div class="details">
                                        <div class="left">
                                            <h6>company name</h6>
                                        </div>
                                        <div class="right">
                                            <h6>${account.companyinfo.name}</h6>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="details">
                                        <div class="left">
                                            <h6>email address</h6>
                                        </div>
                                        <div class="right">
                                            <h6>${account.companyinfo.email}</h6>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="details">
                                        <div class="left">
                                            <h6>Phone No.</h6>
                                        </div>
                                        <div class="right">
                                            <h6>${account.companyinfo['phone'] != null ? account.companyinfo.phone : ''}</h6>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="details">
                                        <div class="left">
                                            <h6>Address</h6>
                                        </div>
                                        <div class="right">
                                            <h6>${account.companyinfo.address}</h6>
                                        </div>
                                    </div>
                                </li>
                                
                                
                                
                                
                            </ul>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
    </div>`
    //}

    
        
    var data = {html: html};

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}


exports.getMySettings = async function(req_session,req_body){
    console.log('75: START getMySettings(')
    console.log(`75: req_body= ${JSON.stringify(req_body,null,4)}`)
 
    console.log(')')

    //let req_session = req.session
    //let basic_data = await CommonService.get_basic_data(req_session)
    
   // if(basic_data.statusCode != 200){
   //     return {statusCode:500}
   // }

    //let data = basic_data.data

    //let categories = basic_data.categories //await categoryTable.find({status: true})

    //let menu_categories = basic_data.menu_categories //[]

    //let cart = basic_data.cart

    //let eth = basic_data.eth


    
    //let user =  req_session.user
    let username = req_session.user.username

    //if(user.username != 'guest' ){
        let account = await CommonService.getAccount(username)
        /*
        if(account['username']){
            //update userinfo if needed
            let query_set = {}
            */
            //if(data.user['name'] == null){
               // data.user['name'] = account.name
             //query_set['name'] = data.user.name
           // }
 
            
            
            //if(data.user['userinfo'] == null){
                //data.user['userinfo'] = account.userinfo
                /*{
                 shipping_address: config.default_shipping_address,
                 billing_address: config.default_billing_address
                 */
           // }
             //query_set['userinfo'] = data.user.userinfo
             
            
            //if(data.user['phone'] == null){
           //     data.user['phone'] =  account.phone
           // }

          //  data.user['wallets'] = account.wallets
            /*
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
     
        
        

    
    let html = ''
    
    
        

        html = `<div class="row">
        <div class="col-12">
            <div class="card mt-0">
                <div class="card-body">
                    <div class="dashboard-box">
                        <div class="dashboard-title">
                            <h4>settings</h4>
                        </div>
                        <div class="dashboard-detail">
                            
                        
                            <div class="account-setting">
                                <h5>deactivate account</h5>
                                <div class="row">
                                    <div class="col">
                                        <div class="form-check">
                                            <input class="radio_animated form-check-input"
                                                type="radio" name="exampleRadios1"
                                                id="exampleRadios4" value="option4" checked>
                                            <label class="form-check-label"
                                                for="exampleRadios4">
                                                I have a privacy concern
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="radio_animated form-check-input"
                                                type="radio" name="exampleRadios1"
                                                id="exampleRadios5" value="option5">
                                            <label class="form-check-label"
                                                for="exampleRadios5">
                                                This is temporary
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="radio_animated form-check-input"
                                                type="radio" name="exampleRadios1"
                                                id="exampleRadios6" value="option6">
                                            <label class="form-check-label"
                                                for="exampleRadios6">
                                                other
                                            </label>
                                        </div>
                                        <button type="button"
                                            class="btn btn-solid btn-xs">Deactivate
                                            Account</button>
                                    </div>
                                </div>
                            </div>
                            <div class="account-setting">
                                <h5>Delete account</h5>
                                <div class="row">
                                    <div class="col">
                                        <div class="form-check">
                                            <input class="radio_animated form-check-input"
                                                type="radio" name="exampleRadios3"
                                                id="exampleRadios7" value="option7" checked>
                                            <label class="form-check-label"
                                                for="exampleRadios7">
                                                No longer usable
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="radio_animated form-check-input"
                                                type="radio" name="exampleRadios3"
                                                id="exampleRadios8" value="option8">
                                            <label class="form-check-label"
                                                for="exampleRadios8">
                                                Want to switch on other account
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="radio_animated form-check-input"
                                                type="radio" name="exampleRadios3"
                                                id="exampleRadios9" value="option9">
                                            <label class="form-check-label"
                                                for="exampleRadios9">
                                                other
                                            </label>
                                        </div>
                                        <button type="button"
                                            class="btn btn-solid btn-xs">Delete Account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    //}

    
        
    var data = {html: html};

    //console.log(`340: END exports.quickview data= ${JSON.stringify(data,null,4)}  `)

    return {statusCode:200,data:data}
  
    
}

exports.editProduct_dep = async function(req_session,req_body) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`1991: START vendor.service.js exports.editProduct req_params=${JSON.stringify(req_body,null,4)}`)
    
    let categories = await CommonService.get_categories(req_session)

    if(categories.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = categories.data
    data['user'] = req_session.user

    let user = data.user
    let username = user.username
    

    if(req_body == null || req_body["id"] == null){
    
       
        console.log(`2011: Product id is missing!`)
        return {statusCode:500}
        
        
    } 

    let id = req_body.id

    let qry = {createdby:username, id:id}
    console.log(`2020: Product qry = ${JSON.stringify(qry,null,4)}`)
    let existing_product = await productTable.findOne(qry)
    if(existing_product == null ||  existing_product['id'] == null){
        
        console.log(`2024: Product ${id} DOES NOT exists!`)
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
        await productTable.update({createdby:username,id:existing_product.id},{$set:qry_set})

        existing_product = await productTable.findOne(qry)
    }
    
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})
        
    //let data = {categories: categories, brands: brands, product:existing_product}
    
    data['product'] = existing_product
        
    
        //res.redirect(`/vendor/product/edit/${existing_product.guid}`);
        
        return {statusCode:200,data:data}
            
}

exports.editProduct = async function(req_session,id) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`1991: START vendor.service.js exports.editProduct id=${JSON.stringify(id,null,4)}`)
    
    let categories = await CommonService.get_categories(req_session)

    if(categories.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = categories.data
    data['user'] = req_session.user

    let user = data.user
    let username = user.username
    
/*
    if(req_body == null || req_body["id"] == null){
    
       
        console.log(`2011: Product id is missing!`)
        return {statusCode:500}
        
        
    } 


    let id = req_body.id
*/
    let qry = {createdby:username, id:id}
    console.log(`2020: Product qry = ${JSON.stringify(qry,null,4)}`)
    let existing_product = await productTable.findOne(qry)
    if(existing_product == null ||  existing_product['id'] == null){
        
        console.log(`2024: Product ${id} DOES NOT exists!`)
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
        await productTable.update({createdby:username,id:existing_product.id},{$set:qry_set})

        existing_product = await productTable.findOne(qry)
    }
    
    //let categories = await categoryTable.find({status: true})

    //let brands = await brandTable.find({status: true})
        
    //let data = {categories: categories, brands: brands, product:existing_product}
    
    data['product'] = existing_product
        
    
        //res.redirect(`/vendor/product/edit/${existing_product.guid}`);
        
        return {statusCode:200,data:data}
            
}


exports.removeProduct = async function(req_session,id) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    //console.log(`1991: START vendor.service.js exports.removeProduct id=${JSON.stringify(id,null,4)}`)
    let qry = {createdby:req_session.user.username, guid:id}
    console.log(`1991: START vendor.service.js exports.removeProduct qry=${JSON.stringify(qry,null,4)}`)
    
    
    await productTable.remove(qry)
    
    
    
    
        //res.redirect(`/vendor/product/edit/${existing_product.guid}`);
        
        return {statusCode:200}
            
}
