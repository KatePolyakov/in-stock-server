const router = require('express').Router();
const inventoriesController = require('../controllers/inventories-controller');

router.route('/inventories-warehouses')
.get(inventoriesController.inventoryWarehouseList)
.post(inventoriesController.postInventoryItem);

router.route('/inventories-warehouses/:inventoryId')
.put(inventoriesController.updateInventoryItem)

module.exports = router;