const router = require('express').Router();
const warehousesController = require('../controllers/warehouses-controller');

router.route('/').get(warehousesController.index);

module.exports = router