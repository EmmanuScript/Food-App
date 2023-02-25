const authController = require('../controllers/authController')
const regController = require('../controllers/regController')
const { Router } = require('express')

const router = Router()

router.get('/signup', regController.signup_get)

router.post('/signup', regController.signup_post)

router.get('/login', regController.login_get)

router.post('/login', regController.login_post)

router.get('/logout', regController.logout_get)

router.post('/make-order', authController.make_order_post)

router.get('/make-order', authController.make_order_get)

router.get('/', authController.index)

router.get('/get-orders', authController.get_orders)

router.patch('/edit-order', authController.edit_order)

router.delete('/delete-order', authController.delete_order)


module.exports = router