var express = require('express')
var router = express.Router()

const OfferController = require('../controller/offer.controller')

//router.get('/checkout', OrderController.checkout)
router.post('/submit', OfferController.submit) 
router.get('/failed', OfferController.failed)
router.get('/tracking/:id', OfferController.tracking)





module.exports = router;
