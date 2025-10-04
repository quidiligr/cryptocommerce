

module.exports = {

    kMongoDb:'mongodb://mongodb:27017/cryptocommercedb',
 kRootUrl: 'https://www.yourdomain.com',
 guest_user :{
    username:'guest',
    email:'guest@yourdomain.com',
    roleId:'guest',
    name: 'Guest',
    currency: 'USD',
    crypto: 'ETH',
    
},



default_customer :{
    name:'guest',
    email:'guest@yourdomain.com',
    phone:'+1(310)1234-4567',
    shipping_address:{
        address : "",
        address1 : "",
        address2 : "",
        city : "Las Vegas",
        state : "Nevada",
        postal : "89101",
        country : "United States"
    }
    
},



default_shipping_address:{
    
    rawAddress: "",
    address: "USA",
    formattedAdress: "USA",
    latitude: 0.0,
    longitude: 0.0,
    streetNumber: "",
    streetName: "",
    city: "",
    county: "",
    state: "",
    country: "United States",
    countryCode: "US",
    zipCode: ""
},
default_billing_address:{
    rawAddress: "",
    address: "USA",
    formattedAdress: "USA",
    latitude: 0.0,
    longitude: 0.0,
    streetNumber: "",
    streetName: "",
    city: "",
    county: "",
    state: "",
    country: "United States",
    countryCode: "US",
    zipCode: ""
},

currencies:{
    'USD':{'currency':'USD','symbol':'$'},
    'EUR':{'currency':'EUR','symbol':'€'},  
},
default_currency:{'currency':'USD','symbol':'$'},

country: [
    'United States',
    'Australia',
    'Europe',
    'Netherlands',
    'South Africa'
],
seller_wallet: '0x3Ad54CcC9AD0FE8b...',
master_pwd: 'your master passwword!',
notify_from_email: 'test@gmail.com',
error_processing: 'There was an error processing your request. Please try again later',
google_api_key: 'your api key'



   
}    