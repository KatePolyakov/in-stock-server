const router = require('express').Router();
const warehousesController = require('../controllers/warehouses-controller');

router.route('/warehouses').get(warehousesController.index);

module.exports = router;