var express = require('express')
//var bcrypt = require('bcrypt');
var router = express.Router()

/*
router.get('/sign-up', function(req, res, next) { 

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands');  
    var accountTable = db.get('accounts');  
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        res.render('account/register', data);
    });
    
});

router.post('/sign-up', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            accountTable.count({username: req.body.username}, function(e, count) {
                if(count == 0) {
                    bcrypt.hash(req.body.password, 13, function(err, hash) {
                        req.body.password = hash;
                        req.body.status = true;
                        req.body.roleId = 'customer';
                        accountTable.insert(req.body, function(err, result){
                            callback(null, {count: 0});                            
                        });
                    });
                } else {
                    callback(null, {count: count});
                }
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        var countAccount = results[2];
        if(countAccount.count == 0) {
            res.title = 'Login'; 
            res.render('account/login', data);
        } else {
            res.title = 'Register'; 
            data['message'] = 'Exits';
            res.render('account/register', data);
        }
    });
});

router.get('/login', function(req, res, next) { 
    
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        //res.render('account/login', data);
        res.render('account/login', data);
    });
});

router.post('/login', function(req, res, next) { 

    console.log('107: START /login')
    console.log(`108: ${JSON.stringify(req.body,null,4)}`)
    

    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            
            
            let password = req.body.password
            let username =''
            let email = ''
            if(req.body.email.includes('@')){
                
                email=req.body.email
            }
            else{
                username =req.body.email
            }

            let qry_find = {}
            
            if(username){
                qry_find = {$and: [{username: username}, {status: true}, {roleId: 'customer'}]}
            }
            else{
                qry_find = {$and: [{email: email}, {status: true}, {roleId: 'customer'}]}
            }
            
            accountTable.findOne(qry_find, function(e, account){
                if(account != null) {
                    bcrypt.compare(password, account.password, function(err, res) {
                        if(res) {
                            req.session.username = account.username;
                            callback(null, {count: 1});
                        } else {
                            callback(null, {count: 0});
                        }
                    });
                } else {
                    callback(null, {count: 0});
                }
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        var countAccount = results[2];
        if(countAccount.count == 0) {
            console.log('80: /login FAILED')
            data['message'] = 'Invalid Account'
            res.render('account/login')
            //res.redirect('/')
        } else {
            console.log('80: /login OK')
            //res.redirect('/account/orders')
            res.redirect('/account/dashboard')
            //res.redirect('/');
        }
        
    });
});

router.get('/logout', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            delete req.session.username;
            callback();
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1] };
        res.render('account/login', data);
    });
});

router.get('/change-profile', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            accountTable.findOne({username: req.session.username}, function(e, account){
                callback(null, account);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], account: results[2] };
        res.render('account/change_profile', data);
    });
});

router.post('/change-profile', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var accountTable = db.get('accounts');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            accountTable.findOne({username: req.session.username}, function(e, account) {
                if(req.body.password != '') {
                    bcrypt.hash(req.body.password, 13, function(err, hash) {                        
                        accountTable.update({username: req.session.username}, {$set : {password: hash, fullName: req.body.fullName, email: req.body.email}}, function(e, result) {
                            accountTable.findOne({username: req.session.username}, function(e, account) {
                                callback(null, account);
                            });
                        });
                    });
                } else {                    
                    accountTable.update({username: req.session.username}, {$set : {fullName: req.body.fullName, email: req.body.email}}, function(e, result) {
                        accountTable.findOne({username: req.session.username}, function(e, account) {
                            callback(null, account);
                        });
                    });
                }
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], account: results[2] };
        res.render('account/change_profile', data);
    });
});


router.get('/dashboard', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('account/dashboard', data);
    });
});
*/

/*
router.get('/', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('vendor/dashboard', data);
    });
});
*/
const VendorController = require('../controller/vendor.controller') 
const upload = require('../upload')

router.get('/', VendorController.dashboard)


router.get('/product-list', VendorController.product_list)


router.get('/add-product', VendorController.add_product)

router.get('/remove-product/:guid', VendorController.remove_product)


router.get('/edit-product/:guid', VendorController.edit_product)

router.get('/edit-product-page/:guid', VendorController.edit_product_page)

router.post('/edit-product', VendorController.save_product)

router.post('/edit-product-page', VendorController.save_product)

router.get('/product-detail/:guid', VendorController.product_detail)

router.get('/order-list', VendorController.order_list)

router.get('/offer-list', VendorController.offer_list)


router.post('/upload',async (req,res) => {
    console.log(`370: START /upload`)
    console.log(`370: req.body = ${JSON.stringify(req.body,null,4)}`)
    
    let returnurl = '/myaccount'
    if(req.body['returnurl'] != null){
        returnurl = req.body.returnurl 
    }
    else{
        if(req.body['prodguid'] != null){
            returnurl =  `/vendor/edit-product/${req.body.prodguid}`
        }
        
    }
     
    console.log(`370: returnurl = ${returnurl}`)
    
    const VendorService = require('../services/vendor.service') 
        
    const fs = require('fs');
    const path = require('path')
    const util = require('util');
    const uploads_tmp_path = '/home/rom/projects/walter/cryptibuyejs/ShoppingCart/public/uploads_tmp' //'/data/uploads.peerxc.com/uploads_tmp'
    const uploads_path = '/home/rom/projects/walter/cryptibuyejs/ShoppingCart/public/uploads'
    const multer = require('multer')
    const fs_exists = util.promisify(fs.exists)
    const fs_mkdir = util.promisify(fs.mkdir)
    const fs_rename = util.promisify(fs.rename)

    let username = req.session.username
    let user_tmp_dir=`${uploads_tmp_path}/${username}`

        
    //let user_tmp_dir=`${uploads_tmp_path}/${username}`
    let user_dir=`${uploads_path}/${username}`
    
    //console.log(`375: user_tmp_dir= ${user_tmp_dir}`)
    if (! await fs_exists(user_tmp_dir)){
        await fs_mkdir(user_tmp_dir, { recursive: true })
    }
    
    if (!await fs_exists(user_dir)){
            await fs_mkdir(user_dir, { recursive: true })
        }
        

    var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
            // this works using normal public
            //callback(null, './public/uploads');
            //console.log(`100: req.body= ${JSON.stringify(req.body)}`);
            console.log(`402: desitnation: `);
            callback(null, user_tmp_dir);
        },
        filename: function (req, file, callback) {
            //console.log(`102: req.body= ${JSON.stringify(req.body)}`);
            //callback(null, file.fieldname + '-' + Date.now());
            //callback(null, file.fieldname + '-' + Date.now());
            console.log(`402: filename ${user_tmp_dir}/${file.originalname}`);
            callback(null, file.originalname);
        }
        });
    
        
    
    var uploadFile = multer({ storage : storage}).single('upload');
    uploadFile(req,res,async (err) => {


        console.log(`419: req.body = ${JSON.stringify(req.body,null,4)}`)
        let guid = req.body.prodguid
        returnurl = req.body['returnurl'] != null ? req.body.returnurl : `/vendor/edit-product/${req.body.prodguid}`
        console.log(`370: returnurl = ${returnurl}`)
                    
        if(err) {
            console.log(`1689.3: ${JSON.stringify(err)}`)
                return res.redirect(returnurl);
        }

        //username,prodguid,originalname,uploadkey
        let filename = req.file.originalname
        
        let uploadkey = req.body.uploadkey
        
        let orig = `${uploads_tmp_path}/${username}/${filename}`
        let dest = `${user_dir}/${filename}`

        let orig_exists = await fs_exists(orig)
        if(!orig_exists){
         
            console.log(`710.1: Does not exists: ${orig}`)
            return res.redirect(returnurl)
        }
            
        
        
            

        await fs_rename(orig, dest) //fs.renameSync(oldPath, file_path)//, function (err) {
        console.log(`710.2: exports.upload`)
        
       
                
        if(guid != null){
            /*let filename = req.file.originalname
            let oldPath = `${uploads_tmp_path}/${req.session.username}/${filename}`
            let file_path = `${uploads_path}/${req.session.username}/${filename}`

            console.log(`710.3: oldPath: ${oldPath}`)
            console.log(`710.4: file_path: ${file_path}`)

            let oldPath_exists = await fs_exists(oldPath)
            if(!oldPath_exists){
            
                console.log(`710.1: Does not exists oldPath: ${oldPath}`)
                //return {statusCode:500}
                return res.redirect(returnurl);
            }

            let file_path_exists = await fs_exists(file_path)
            if(!file_path_exists){
            
                console.log(`710.1: Does not exists file_path: ${file_path}`)
                //return {statusCode:500}
                return res.redirect(returnurl)
            }


            await fs_rename(oldPath, file_path)
            */

            await VendorService.upload_savedb({uploadkey: uploadkey,guid: guid, username: username, filename: filename})
            
        }
       
       
        return res.redirect(returnurl);
                    
            
    });

    
});

/*
router.post('/upload',async (req,res) => {
    
	console.log(`1689: START /uploads req.token= ${JSON.stringify(req.token)}`);

    const fs = require('fs');
    const path = require('path')
    const util = require('util')
    const multer = require('multer')

    const uploads_tmp_path = '/home/rom/projects/walter/cryptibuyejs/ShoppingCart/public/uploads_tmp' //'/data/uploads.peerxc.com/uploads_tmp'
    const uploads_path =     '/home/rom/projects/walter/cryptibuyejs/ShoppingCart/public/uploads'

    let username = req.session.username
    let user_tmp_dir=`${uploads_tmp_path}/${username}`
    let user_dir=`${uploads_path}/${username}`
    const VendorService = require('../services/vendor.service') 

    console.log(`1689.1: user_tmp_dir= ${user_tmp_dir}`)
    if (!fs.existsSync(user_tmp_dir)){
        fs.mkdirSync(user_tmp_dir, { recursive: true })
    }
    if (!fs.existsSync(user_dir)){
        fs.mkdirSync(user_dir, { recursive: true })
    }
            
    var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
            // this works using normal public
            //callback(null, './public/uploads');
            //console.log(`100: req.body= ${JSON.stringify(req.body)}`);
            callback(null, user_tmp_dir);
        },
        filename: function (req, file, callback) {
            //console.log(`102: req.body= ${JSON.stringify(req.body)}`);
            //callback(null, file.fieldname + '-' + Date.now());
            //callback(null, file.fieldname + '-' + Date.now());
            console.log(`1689.2: Saving file to ${user_tmp_dir}/${file.originalname}`);
            callback(null, file.originalname);
        }
        });

    var uploadFile = multer({ storage: storage }).single('upload')
          
   // var uploadFilesMiddleware = util.promisify(uploadFiles);

   uploadFile(req,res,async (err) => {

    console.log(`513: body_data= ${JSON.stringify(req.body,null,4)}`)
	
    let guid = req.body.prodguid
        if(err) {
            console.log(`1689.3: ${JSON.stringify(err)}`);
                //return res.end("1689.4: Error uploading file.");
                return res.redirect(`/vendor/edit-product/${guid}`);
        }

       
        
        let filename = req.file.originalname
        
        let uploadkey = req.body.uploadkey
        
        let orig = `${uploads_tmp_path}/${username}/${filename}`
        let dest = `${user_dir}/${filename}`
        fs.renameSync(orig, dest)
        
        
            

        //await fs_rename(orig, dest) //fs.renameSync(oldPath, file_path)//, function (err) {
        console.log(`710: exports.upload`)
        
        await VendorService.upload_savedb({uploadkey: uploadkey, username: username, filename: filename,guid:guid})
       
        
                    return res.redirect(`/vendor/edit-product/${guid}`);
                  
                    
        
        
            
            
    });
});


router.get('/product-detail', function(req, res, next) { 
    console.log('373: START /product-detail')
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('vendor/product-detail', data);
    });
});
*/

router.get('/orders', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            ordersTable.find({username: req.session.username}, function(e, orders) {
                callback(null, orders);
            });
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orders: results[2] };
        res.render('account/orders', data);
    });
});

router.get('/order/detail/:id', function(req, res, next) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    var brandTable = db.get('brands'); 
    var ordersTable = db.get('orders');
    var ordersDetailTable = db.get('orderdetails');
    
    async.parallel([
        function(callback){
            categoryTable.find({status: true},{}, function(e, categories){
                callback(null, categories);
            });            
        },
        function(callback){
            brandTable.find({status: true},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback) {
          
            ordersDetailTable.aggregate({
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"id",
                    as:"productInfo"
                }                
            }, function(e, result) { 
                    var orderDetails = [];
                    for(var i = 0; i < result.length; i++) {
                        if(result[i].orderId == req.params.id) {
                            orderDetails.push(result[i]);
                        }
                    }
                    callback(null, orderDetails);
            });
            
        }
    ], 
    function(err, results) {
        var data = {categories: results[0], brands: results[1], orderDetails: results[2] };
        res.render('account/orders_detail', data);
    });
});


module.exports = router;
