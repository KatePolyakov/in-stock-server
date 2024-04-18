const knex = require('knex')(require('../knexfile'));

const inventoryWarehouseList = async (_req, res) => {
  try {
    const data = await knex
      .select('inventories.id', 'inventories.item_name', 'inventories.description', 'inventories.category', 'inventories.status', 'inventories.quantity', 'warehouses.warehouse_name as warehouse_name')
      .from('inventories')
      .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: `Error getting the list` })
  }
}

const postInventoryItem = async (req, res) => {
  const { 
    warehouse_id, 
    item_name, 
    description, 
    category, 
    status, 
    quantity 
  } = req.body
  const errors = []
  if (!warehouse_id || !item_name || !description || !category || !status || !quantity) {
    errors.push('Missing properties in the request body')
  }
  const warehouseExists = await knex('warehouses').where('id', warehouse_id).first()
  if (!warehouseExists) {
    errors.push('Warehouse_id does not exist')
  }
  if(isNaN(quantity)) {
    errors.push('Quantity must be a number')
  }
  if(errors.length > 0) {
    return res.status(400).json({ errors })
  }
  const postData = req.body
  try {
    const data = await knex('inventories')
    .insert(postData)
    const newInventoryItem = data[0];
    const createdInventoryItem = await knex('inventories')
      .where({ id: newInventoryItem })
      .first();

    res.status(201).json({ createdInventoryItem })
  } catch (err) {
    res.status(500).json({ message: `Error creating the inventory item` })
  }
}

module.exports = {
  inventoryWarehouseList,
  postInventoryItem
};