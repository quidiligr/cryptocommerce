var express = require('express');
var router = express.Router();
const APIController = require('../controller/api.controller') 
//const VendorController = require('../controller/vendor.controller') 

router.post('/add-to-cart', APIController.cart_add)

router.post('/remove-from-cart', APIController.cart_removeitem)

router.post('/quickview', APIController.quickview)

router.post('/makeoffer', APIController.makeoffer)

router.post('/get-my-wallets', APIController.getMyWallets)

router.post('/remove-wallet', APIController.mywallet_remove)

router.post('/save-wallet', APIController.mywallet_edit)

router.post('/get-my-products', APIController.getMyProducts)
router.post('/get-my-orders', APIController.getMyOrders)
router.post('/get-sale-orders', APIController.getSaleOrders)
router.post('/get-payouts', APIController.getPayouts)
router.post('/get-my-offers', APIController.getMyOffers)
router.post('/get-my-info', APIController.getMyInfo)
router.post('/get-my-business-profile', APIController.getMyBusinessProfile)
router.post('/get-my-security', APIController.getMySettings)

router.post('/add-product', APIController.addProduct)
router.post('/get-edit-product', APIController.getEditProduct)
router.post('/remove-product', APIController.removeProduct)




module.exports = router;
