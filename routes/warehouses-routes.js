const router = require('express').Router();
const warehousesController = require('../controllers/warehouses-controller');

router.route('/warehouses')
  .get(warehousesController.index)
  .post(warehousesController.postWarehouse)

router.route('/warehouses/:warehouse_id').get(warehousesController.singleWarehouse)

module.exports = router;