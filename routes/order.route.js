var express = require('express')
var router = express.Router()

const OrderController = require('../controller/order.controller')

router.get('/checkout', OrderController.checkout)
router.post('/success', OrderController.success) 
router.get('/failed', OrderController.failed)
router.get('/tracking/:id', OrderController.tracking)





module.exports = router;
