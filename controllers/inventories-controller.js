const knex = require('knex')(require('../knexfile'));

const inventoryWarehouseList = async (_req, res) => {
  try {
    const data = await knex
      .select('inventories.id', 'inventories.item_name', 'inventories.description', 'inventories.category', 'inventories.status', 'inventories.quantity', 'warehouses.warehouse_name as warehouse_name')
      .from('inventories')
      .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')

    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: `Error getting the list` })
  }
}

module.exports = {
  inventoryWarehouseList
};