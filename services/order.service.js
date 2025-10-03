const config = require('../config/config')
const monk = require('monk')

const db = monk(config.kMongoDb)

const orderTable = db.get('orders');
const orderDetailsTable = db.get('orderdetails');
const accountsTable = db.get('accounts');
const transactwallet = db.get('transactwallet')
const CommonService = require('../services/common.service')   
const EmailService = require('../services/email.service')


exports.checkout = async function(req_session) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`18: START order.service.js checkout(req_session=${JSON.stringify(req_session,null,4)}`)
    
    
    
    //let username = req_session.user.username
    

    
    
    

    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        
        return {statusCode:501}
    }


    let data = basic_data.data
    
    
    data['current_url'] = '/checkout' 
    
    data['shipping_address'] = config.default_currency
    
    let customer = config.default_customer
    let account = await accountsTable.findOne({username:req_session.user.username})    
    
    if(account){
        customer.name = account.name?account.name: account.fullName
        customer.email =account.email
        customer.phone = account.phone

        if(account.shipping_address){
            customer.shipping_address = account.shipping_address
        }
    }
    
    data['cust'] = customer
    data['country'] = config.country
    
    return {statusCode:200,data:data}
    
    
}

exports.success_dep = async (req_session,req_body) =>{
    //router.post('/success', function(req, res, next) { 

        
    
        console.log(`68.1: START order.service success req_body= ${JSON.stringify(req_body,null,4)}`)
        console.log(`68.2: req_session= ${JSON.stringify(req_session,null,4)}`)
        /*
         req_body= {
            "seller_wallet": "0x3Ad54CcC9AD0FE8b6bA9168D59C7fB36e220571D",
            "sum": "1.2",
            "sum_eth": "0.00046600132033703995",
            "eth_exchange": "0.0003883344336142",
            "transaction_hash": "",
            "buyer": "Customer 2",
            "buyer_phone": "",
            "buyer_email": "customer2@romnix.com",
            "buyer_country": "Europe",
            "buyer_address": "",
            "buyer_city": "",
            "buyer_state": "",
            "buyer_postal": "",
            "payment-group": "on"
            }
        */
      
        let basic_data = await CommonService.get_basic_data(req_session)
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
       
       if(basic_data.statusCode != 200 ){
           console.log('68.3 get_basic_data statusCode NOT 200!!!')
           return {statusCode:500}
       }

       let data = basic_data.data

       //repalce eth with post data
       
       

       
        let transaction_hash_str = req_body['transaction_hash'] != null ? req_body['transaction_hash'] : ''

        if(transaction_hash_str.length == 0){
            console.log('No transaction_hash')
            //return {statusCode: 500}
        }
        //let id = crypto.createHash('md5').update(transaction_hash_str).digest("hex")
        //let seller = req_body['seller']
        let order_id = `${Date.now()}`
        //id=`${seller}-${id}`
        /*
        if(id == null){
            
            console.log('error creating id!')
            return {statusCode: 500}
        }
        */

        let transact = {}
        let transaction_hash = {}
        
        if(transaction_hash_str != ""){
            transaction_hash =  JSON.parse(transaction_hash_str)
            hash =  transaction_hash
            transact = {
                'Block Hash': hash['blockHash'],
                'Block Number': hash['blockNumber'],
                'Gas Price': hash['effectiveGasPrice'],
                'Gas Used': hash['gasUsed'],
                'Buyer Wallet': hash['from'],
                'Seller Wallet': hash['to'],
                'Transaction Hash': hash['transactionHash'],
                
                
            }
        }
        data['transact'] = transact

/*
        let eth_exchange_now =  await CommonService.get_eth_rates()
        if(eth_exchange_now.statusCode != 200){
            
        }

        eth_exchange_now = eth_exchange_now.data
*/
        let currency = data.currency
        let eth_exchange_now = data.eth

        let eth_exchange = req_body['eth_exchange'] != null ? parseFloat(req_body['eth_exchange']) : eth_exchange_now


        try{

            let account = await accountsTable.findOne({username: req_session.user.username, roleId:'customer'})
            if(account.username){
                console.log(`customer ${req_session.user.username} exists!`)
            }
            else{
                return({statusCode:502})
            }

            


            let order_date = new Date()
            let order_date_str = order_date.toISOString()

            let order = {}
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

            let email_sellers = []

            let date_now = new Date()
              
                for(var i = 0; i < data.cart.items.length; i++) {
                    let price = data.cart.items[i].product.price
                    price['eth'] = {amount:price.amount * eth_exchange}
                    let od = {
                        id: `${order_id}-${i+1}`,//req.query.tx,
                        order_id: order_id,
                        order_date: order_date,
                        order_date_str:  order_date_str,
                        order_status:'confirmed', //shipped,out for delivery, delivered
                        
                        confirmed_date: {date: date_now,date_iso_str:date_now.toISOString()},
                        shipped_date: null,
                        out_delivery_date: null,
                        delivered_date: null,
                        


                        
                        shipping: {
                            
                            address:'',carrier:'',tracking:''
                        
                        },
                        payout:{status:'', date: ''},
                        payment:{status:'PAID', date: new Date().toISOString()},
                        
                        
                        product_id: data.cart.items[i].product.id,
                        name: data.cart.items[i].product.name,
                        product_name: data.cart.items[i].product.name,
                        
                        /*
                        price: { 
                            amount: data.cart.items[i].product.price,
                            currency: data.cart.items[i].product.currency,
                            amount_eth: data.cart.items[i].product.price * data.eth},
                        */
                        price: price,
                            
                        quantity: data.cart.items[i].quantity,
                        photo: data.cart.items[i].product.upload1,
                        username:req_session.user.username, 
                        seller: data.cart.items[i].product.createdby
                    }
                    
                    orderdetails.push(od);

                    let seller_account = await accountsTable.findOne({username:od.seller})
                    if(seller_account && seller_account.email){
                        console.log('250.1 :oderder.service')
                        
                        
                        //email
                        let exist = null
                        if(email_sellers.length > 0){
                            //const result = inventory.find(({ name }) => name === "cherries");

                            exist  = email_sellers.find(({from}) => from === seller_account.email)
                            
                        }
                        if(exist){
                            //skip
                        }
                        else{
                            let email_seller = {
                                //from:'admin@physicianreviewservice.com',
                                from:config.notify_from_email,
                                to: seller_account.email,//'rquidilig@gmail.com',//r.email,//'rquidilig@physicianreviewservices.com',
                                subject: `You have a new order.`,
                                //body:`Dear Dr. X
                                //body: {text:`Code: ${new_account.email_verify.code}`}
                                body: {text:`Hi ${seller_account.name},\n You have a new order from user ${od.username}. Order #: ${od.id}. Please login to your account to continue.`}
                
                            }
                            email_sellers.push(email_seller)

                        }
                        
                        

                    }
                    else{
                        console.log('250.1 oderder.service no seller email!!!!')
                    }

                    



                    
                    
                }
      /*          
db.accounts.update({username:'customer2'},{$set:{"billing_address" : {
"address" : "Emmastraat 1, 1071 JA Amsterdam",
"address1" : "Emmastraat 1",
"address2" : "",
"city" : "Amsterdam",
"state" : "JA",
"postal_code" : "1071",
"country": "Netherlands"
}}})

db.accounts.update({username:'customer1'},{$set:{"billing_address" : {
    "address" : "100 Las Vegas Blvd N, Las Vegas, Nevada  89101",
    "address1" : "100 Las Vegas",
    "address2" : "#101",
    "city" : "Las Vegas",
    "state" : "Nevada",
    "postal_code" : "89101",
    "country": "USA"
    }}})
    */
 
                let shipping_cost = {amount: 0.0, currency: data.cart.currency}
                let tax = {amount: 0.0, currency: data.cart.currency}
                let subtotal = data.cart.sum 
                //let subtotal_eth = data.cart.sum_eth 
                let total = {amount: data.cart.sum.amount + shipping_cost.amount + tax.amount,currency:currency}
                total['eth'] = {amount: total.amount * eth_exchange}
                
                let cust_address ={
                    address1:req_body['cust_address1'],
                    address2:req_body['cust_address2'],
                    city:req_body['cust_city'],
                    state:req_body['cust_state'],
                    zipcode:req_body['cust_zipcode'],
                    country:req_body['cust_country'],
                    
            }
            cust_address['address'] = `${cust_address.address1} ${cust_address.address2}, ${cust_address.city}, ${cust_address.state} ${cust_address.zipcode}, ${cust_address.country}`
                 
            order = {
                id: order_id,//req.query.tx, 
                // product
                //created: new Date().toLocaleDateString(), 
                order_date: order_date,
                order_date_str:  order_date_str,
                username: req_session.user.username, 
                email: req_session.user.email, 
                customer: {
                    number : account.customer_number,
                    name: req_body['cust_name'],// req_session.user.username, 
                    phone:req_body['cust_phone'],
                    email:req_body['cust_email'],
                    //address: cust_address,
                    shipping_address: cust_address,
                    //country:req_body['cust_country'],
                    //address:req_body['cust_'],
                    //city:req_body['cust_city'],
                    //state:req_body['cust_state'],
                    //city:req_body['cust_city'],
                    //state:req_body['cust_state'],
                    //postal:req_body['cust_postal'],
                    wallet:req_body['cust_wallet'],
                },
                payment_group: req_body['payment_group'],
                    

                //seller : seller,
                status: 1,
                //buyer_wallet:  req_body['buyer_wallet'] != null ? req_body['buyer_wallet'] : '', 
                seller_wallet:  req_body['seller_wallet'] != null ? req_body['seller_wallet'] : '',
                shipping_cost: shipping_cost,
                shipping:{
                    cost: {amount:0.00,currency:currency},
                    carrier: 'FedEx',
                    carrier_tracking_number: Date.now(),
                    expected_delivery: new Date(order_date.setDate(order_date.getDate() + 7)),
                    address:cust_address
                },
                currency:currency,
                tax: tax,
                //amount_eth:  req_body['sum_eth'] != null ? parseFloat(req_body['sum_eth']) : 0.0,
                subtotal: subtotal,  //req_body['sum'] != null ? parseFloat(req_body['sum']) : 0.0,
                //subtotal_eth: subtotal_eth,
                total: total,
                //total_eth: total_eth,
                transaction_hash_str: transaction_hash_str,
                transaction_hash: transaction_hash,
                eth_exchange: eth_exchange,
                raw_data: JSON.stringify(req_body),
                order_details: orderdetails
                

            }



            await orderTable.insert(order)
            
            await orderDetailsTable.insert(orderdetails)
           
            
            // Remove cart
            delete req_session.cart;

            delete data.cart
    
            data['order'] = order

            let email_customer = {
                //from:'admin@physicianreviewservice.com',
                from:config.notify_from_email,
                to: order.email,//'rquidilig@gmail.com',//r.email,//'rquidilig@physicianreviewservices.com',
                subject: `Order success.`,
                //body:`Dear Dr. X
                //body: {text:`Code: ${new_account.email_verify.code}`}
                body: {text:`Thank you for your order. Your order #: ${order.id}. Please login to your account to check the status.`}

            }
            
            await EmailService.send3(email_customer)

            /*
            let email_seller = {
                //from:'admin@physicianreviewservice.com',
                from:config.notify_from_email,
                to: order.email,//'rquidilig@gmail.com',//r.email,//'rquidilig@physicianreviewservices.com',
                subject: `You have a new order.`,
                //body:`Dear Dr. X
                //body: {text:`Code: ${new_account.email_verify.code}`}
                body: {text:`You have a new order from user ${order.username}. Order #: ${order.id}. Please login to your account to continue.`}

            }
            
            await EmailService.send3(email_seller)
            */
           console.log(`426: email_sellers= ${JSON.stringify(email_sellers,null,4)}`)
           if(email_sellers.length > 0){
               for(m of email_sellers){
                console.log(`426: m= ${JSON.stringify(m,null,4)}`)
                await EmailService.send3(m)
               }
           }
                    
        }
        catch(error){
            console.log(`error= ${JSON.stringify(error.stack,null,4)}`)
            return {statusCode:500}

        }
                
            
            
                return {statusCode:200,data}
           // res.render('cart/thanks', data);
}

//separate ordres by seller
exports.success = async (req_session,req_body) =>{
    //router.post('/success', function(req, res, next) { 

        
    
        console.log(`68.1: START order.service success req_body= ${JSON.stringify(req_body,null,4)}`)
        console.log(`68.2: req_session= ${JSON.stringify(req_session,null,4)}`)
        /*
         req_body= {
            "seller_wallet": "0x3Ad54CcC9AD0FE8b6bA9168D59C7fB36e220571D",
            "sum": "1.2",
            "sum_eth": "0.00046600132033703995",
            "eth_exchange": "0.0003883344336142",
            "transaction_hash": "",
            "buyer": "Customer 2",
            "buyer_phone": "",
            "buyer_email": "customer2@romnix.com",
            "buyer_country": "Europe",
            "buyer_address": "",
            "buyer_city": "",
            "buyer_state": "",
            "buyer_postal": "",
            "payment-group": "on"
            }
        */
      
        
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
       
       

       //repalce eth with post data
       

       

       
        let transaction_hash_str = req_body['transaction_hash'] != null ? req_body['transaction_hash'] : ''

        if(transaction_hash_str.length == 0){
            console.log('No transaction_hash')
            //return {statusCode: 500}
        }
        //let id = crypto.createHash('md5').update(transaction_hash_str).digest("hex")
        //let seller = req_body['seller']
        let now = Date.now()
        let transact_id = `${now}`
        
        
        //id=`${seller}-${id}`
        /*
        if(id == null){
            
            console.log('error creating id!')
            return {statusCode: 500}
        }
        */

        let transact = {}
        let transaction_hash = {}
        
        if(transaction_hash_str != ""){
            transaction_hash =  JSON.parse(transaction_hash_str)
            hash =  transaction_hash
            transact = {
                'Block Hash': hash['blockHash'],
                'Block Number': hash['blockNumber'],
                'Gas Price': hash['effectiveGasPrice'],
                'Gas Used': hash['gasUsed'],
                'Buyer Wallet': hash['from'],
                'Seller Wallet': hash['to'],
                'Transaction Hash': hash['transactionHash'],
                
                
            }
        }
        
        
        
        let username = req_session.user.username
        await transactwallet.insert({
            id: transact_id,
            created:{
                date:now,
                date_iso:now.toISOString()},
                username:username,  
                transact:transact})

        let basic_data = await CommonService.get_basic_data(req_session)
        if(basic_data.statusCode != 200 ){
            console.log('68.3 get_basic_data statusCode NOT 200!!!')
            return {statusCode:500}
        }
 
        let data = basic_data.data
        data['transact'] = transact

/*
        let eth_exchange_now =  await CommonService.get_eth_rates()
        if(eth_exchange_now.statusCode != 200){
            
        }

        eth_exchange_now = eth_exchange_now.data
*/
        let currency = data.currency
        let eth_exchange_now = data.eth

        let eth_exchange = req_body['eth_exchange'] != null ? parseFloat(req_body['eth_exchange']) : eth_exchange_now



        try{

            let buyer = await accountsTable.findOne({username: username, roleId:'customer'})
            if(buyer.username){
                
            }
            else{
                console.log(`customer ${username} does NOT exists!!!`)
                return({statusCode:502})
            }


            
            

            let order_date = now
            let order_date_str = order_date.toISOString()

            
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

            let email_sellers = []

            let sellers = {}
            for(var i = 0; i < data.cart.items.length; i++) {
                /*
                if(!sellers.includes(s.product.createdby)){
                    sellers.push(s.product.createdby)
                }
                */
               let product =  data.cart.items[i].product

               let order = null //sellers[product.createdby]
    
               

               // create order if needed
               if(sellers[product.createdby] == null){
                    let order_id =  `${new Date()}`
                    let seller = await accountsTable.findOne({username:s.product.createdby})
                    //let buyer = await accountsTable.findOne({username:s.product.createdby})
                    if(seller && seller.username){

                    }
                    else{
                        console.group(`662: seller does not exists!!!`)
                        continue
                    }
                    

                    let cust_address ={
                        address1:req_body['cust_address1'],
                        address2:req_body['cust_address2'],
                        city:req_body['cust_city'],
                        state:req_body['cust_state'],
                        zipcode:req_body['cust_zipcode'],
                        country:req_body['cust_country'],
                        
                    }
                    cust_address['address'] = `${cust_address.address1} ${cust_address.address2}, ${cust_address.city}, ${cust_address.state} ${cust_address.zipcode}, ${cust_address.country}`
                    
                    //let shipping_cost = {amount: 0.0, currency: data.cart.currency}
                    //let tax = {amount: 0.0, currency: data.cart.currency}
                    //let subtotal = data.cart.sum 
                    //let subtotal_eth = data.cart.sum_eth 
                    //let total = {amount: data.cart.sum.amount + shipping_cost.amount + tax.amount,currency:currency}
                    //let total = {amount: 0.0,currency:currency,eth:{amount:0.0}}
                    //total['eth'] = {amount: total.amount * eth_exchange}
                    
                    order = {
                        id: order_id,//req.query.tx, 
                        
                        // product
                        //created: new Date().toLocaleDateString(), 
                        order_date: order_date,
                        order_date_str:  order_date_str,
                        username: req_session.user.username, 
                        seller: product.createdby,
                        email: req_session.user.email, 
                        customer: {
                            number : account.customer_number,
                            name: req_body['cust_name'],// req_session.user.username, 
                            phone:req_body['cust_phone'],
                            email:req_body['cust_email'],
                            //address: cust_address,
                            shipping_address: cust_address,
                            //country:req_body['cust_country'],
                            //address:req_body['cust_'],
                            //city:req_body['cust_city'],
                            //state:req_body['cust_state'],
                            //city:req_body['cust_city'],
                            //state:req_body['cust_state'],
                            //postal:req_body['cust_postal'],
                            wallet:req_body['cust_wallet'],
                        },
                        payment_group: req_body['payment_group'],
                            
        
                        //seller : seller,
                        status: 1,
                        //buyer_wallet:  req_body['buyer_wallet'] != null ? req_body['buyer_wallet'] : '', 
                        seller_wallet:  req_body['seller_wallet'] != null ? req_body['seller_wallet'] : '',
                        shipping_cost: {amount: 0.0, currency: currency},
                        shipping:{
                            cost: {amount:0.0,currency:currency},
                            carrier: 'FedEx',
                            carrier_tracking_number: Date.now(),
                            expected_delivery: new Date(order_date.setDate(order_date.getDate() + 7)),
                            address:cust_address
                        },
                        currency:currency,
                        tax: {amount: 0.0,currency:currency},
                        //amount_eth:  req_body['sum_eth'] != null ? parseFloat(req_body['sum_eth']) : 0.0,
                        subtotal: {amount: 0.0,currency:currency,eth:{amount:0.0}},  //req_body['sum'] != null ? parseFloat(req_body['sum']) : 0.0,
                        //subtotal_eth: subtotal_eth,
                        total: {amount: 0.0,currency:currency,eth:{amount:0.0}},
                        //total_eth: total_eth,
                        
                        transaction_hash_str: transaction_hash_str,
                        transaction_hash: transaction_hash,
                        eth_exchange: eth_exchange,
                        raw_data: JSON.stringify(req_body),
                        order_details: orderdetails
                        
        
                    }

                    let email_notify = null
                    if(seller && seller.email){
                        console.log('250.1 :oderder.service')
                        
                        
                        //email
                        /*
                        let exist = null
                        if(email_sellers.length > 0){
                            //const result = inventory.find(({ name }) => name === "cherries");

                            exist  = email_sellers.find(({from}) => from === seller_account.email)
                            
                        }
                        if(exist){
                            //skip
                        }
                        else{
                            */
                            email_notify = {
                                //from:'admin@physicianreviewservice.com',
                                from:config.notify_from_email,
                                to: seller.email,//'rquidilig@gmail.com',//r.email,//'rquidilig@physicianreviewservices.com',
                                subject: `You have a new order.`,
                                //body:`Dear Dr. X
                                //body: {text:`Code: ${new_account.email_verify.code}`}
                                body: {text:`Hi ${seller.name},\n You have a new order from user ${buyer.username}. Order #: ${order_id}. Please login to your account to continue.`}
                
                            }
                            //email_sellers.push(email_seller)

                        //}
                        
                        

                    }
                    else{
                        console.log('250.1 oderder.service no seller email!!!!')
                    }

                    
                    sellers[s.product.createdby] = {
                        order:order,
                        orderdetails:[],
                        email_notify:email_seller
                    }

                }
                else{
                    order = sellers[product.createdby]
                }


                // create order items
                //for(var i = 0; i < data.cart.items.length; i++) {
                    //let seller = data.cart.items[i].product.createdby
                    //let product = data.cart.items[i].product 
                    
                let price = product.price
                price['eth'] = {amount:price.amount * eth_exchange}
                let od = {
                    id: `${order_id}-${i+1}`,//req.query.tx,
                    order_id: order_id,
                    order_date: order_date,
                    order_date_str:  order_date_str,
                    order_status:'confirmed', //shipped,out for delivery, delivered
                    
                    confirmed: {status: true,date: now,date_iso_str:now.toISOString()},
                    shipped: {status: false},
                    out_delivery: {status: false},
                    delivered: {status: false},
                    shipping: {
                        
                        address:'',carrier:'',tracking:''
                    
                    },
                    payout:{status:'', date: ''},
                    payment:{status:'PAID', date: new Date().toISOString()},
                    
                    
                    product_id: product.id,
                    name: product.name,
                    product_name: product.name,
                    
                    /*
                    price: { 
                        amount: data.cart.items[i].product.price,
                        currency: data.cart.items[i].product.currency,
                        amount_eth: data.cart.items[i].product.price * data.eth},
                    */
                    price: price,
                        
                    quantity: data.cart.items[i].quantity,
                    photo: product.upload1,
                    username:req_session.user.username, 
                    seller: product.createdby
                }
                
                
                order.orderdetails.push(od);
                    
                    
                //}
                




            }

            // save
            for (s of sellers){

                //calculate totals for each seller
                let shipping_cost = {amount: 0.0, currency: currency}
                let tax = {amount: 0.0, currency: currency}
                let subtotal =  {amount: 0.0, currency: currency,eth:{amount:0.0}}
                //let subtotal_eth = data.cart.sum_eth 
                //let total = {amount: data.cart.sum.amount + shipping_cost.amount + tax.amount,currency:currency}
                //let total = {amount: 0.0,currency:currency,eth:{amount:0.0}}
                //total['eth'] = {amount: total.amount * eth_exchange}
                for(od of s.orderdetails){
                    subtotal.amount = subtotal.amount + od.price.amount
                }

                s.order.total.amount = subtotal.amount + shipping_cost.amount + tax.amount
                s.order.total.eth.amount = s.order.total.amount * eth_exchange
                

                await orderTable.insert(order)
            
                await orderDetailsTable.insert(orderdetails)

                
                

            }

            //send email notification
            for(s of sellers){
                console.log(`426: email_sellers= ${JSON.stringify(email_sellers,null,4)}`)
                if(s.email_notify){
                    //for(m of email_sellers){
                        console.log(`426: m= ${JSON.stringify(s.email_notify,null,4)}`)
                        await EmailService.send3(s.email_notify)
                    //}
                }
            }


                
                
            
            
            
            // Remove cart
            delete req_session.cart;

            delete data.cart
    
            data['order'] = order

            let email_customer = {
                //from:'admin@physicianreviewservice.com',
                from:config.notify_from_email,
                to: order.email,//'rquidilig@gmail.com',//r.email,//'rquidilig@physicianreviewservices.com',
                subject: `Order success.`,
                //body:`Dear Dr. X
                //body: {text:`Code: ${new_account.email_verify.code}`}
                body: {text:`Thank you for your order. Your order #: ${order.id}. Please login to your account to check the status.`}

            }
            
            await EmailService.send3(email_customer)

            /*
            let email_seller = {
                //from:'admin@physicianreviewservice.com',
                from:config.notify_from_email,
                to: order.email,//'rquidilig@gmail.com',//r.email,//'rquidilig@physicianreviewservices.com',
                subject: `You have a new order.`,
                //body:`Dear Dr. X
                //body: {text:`Code: ${new_account.email_verify.code}`}
                body: {text:`You have a new order from user ${order.username}. Order #: ${order.id}. Please login to your account to continue.`}

            }
            
            await EmailService.send3(email_seller)
            */
           /*
           console.log(`426: email_sellers= ${JSON.stringify(email_sellers,null,4)}`)
           if(email_sellers.length > 0){
               for(m of email_sellers){
                console.log(`426: m= ${JSON.stringify(m,null,4)}`)
                await EmailService.send3(m)
               }
           }
           */
                    
        }
        catch(error){
            console.log(`error= ${JSON.stringify(error.stack,null,4)}`)
            return {statusCode:500}

        }
                
            
            
                return {statusCode:200,data}
           // res.render('cart/thanks', data);
}



exports.tracking = async function(req_session,req_params) { 
    /*if(!isValidSession(req_body)){
        console.log('31: Invalid session!')
        return {statusCode:500}
    }
    */
    console.log(`355: START order.service.js tracking(req_session=${JSON.stringify(req_session,null,4)}, req_params=${JSON.stringify(req_params,null,4)}`)
    
    
    
    //let username = req_session.user.username
    

    
    
    

    let basic_data = await CommonService.get_basic_data(req_session)

    if(basic_data.statusCode != 200){
        console.log(`369: order.service.js statusCode != 200!!!`)
        return {statusCode:500}
    }

    let data = basic_data.data

    let qry_find 
    if(req_params.role == 'seller'){
        qry_find= {id:req_params.id,username:req_session.user.username}
    
    }
    else{
        qry_find= {id:req_params.id,username:req_session.user.username}
    
    }
    console.log(`376: order.service.js qry_find= ${JSON.stringify(qry_find,null,4)}`)

    //let order = await orderTable.findOne(qry_find)
    

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
            