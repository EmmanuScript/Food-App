const adminController = require('../controllers/adminControllers')
const { Router } = require('express')

const router = Router()


router.post('/menu-post', adminController.menu_post)

router.get('/get-all-orders', adminController.orders_get)

router.get('/get-menu', adminController.get_menu)

router.patch('/edit-menu', adminController.edit_menu)

router.delete('/delete-menu', adminController.delete_menu)

router.delete('/delete-menus', adminController.delete_menus)

router.get('/see-orders', adminController.see_orders)

router.post('/export', adminController.download_order)


module.exports = router