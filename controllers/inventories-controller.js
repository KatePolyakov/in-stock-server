const knex = require('knex')(require('../knexfile'));

const inventoryWarehouseList = async (req, res) => {
  try {
    const data = await knex('inventories')
    .join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id')
    .select('inventories.*', 'warehouses.warehouse_name as warehouse_name') 
    .then(inventories => {
        res.status(200).json(inventories);
    })
  } catch(err) {
    res.status(404).json({ message: `Error getting the list`})
  }
}

module.exports = {
  inventoryWarehouseList
};