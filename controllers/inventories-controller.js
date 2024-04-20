const knex = require('knex')(require('../knexfile'));
const { isValidInventoryData } = require('../utils/validator');

const inventoryWarehouseList = async (req, res) => {
  try {
    const { sort_by, order_by } = req.query;

    const data = await knex
      .select('inventories.id', 'inventories.item_name', 'inventories.description', 'inventories.category', 'inventories.status', 'inventories.quantity', 'warehouses.warehouse_name as warehouse_name')
      .from('inventories')
      .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')
      .orderBy( sort_by, order_by);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: `Error getting the list` })
  }
}

const postInventoryItem = async (req, res) => {
  const errors = await isValidInventoryData(req,res)
  if (errors.length > 0) {
    return res.status(400).json({errors})
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

const updateInventoryItem = async (req, res) => {
  const errors = await isValidInventoryData(req, res)
  if(errors.length > 0) {
    return res.status(400).json({errors})
  }
  const { inventoryId } = req.params
  const putData = req.body
  try {
    const updatedData = await knex('inventories')
    .where({ id: inventoryId })
    .update(putData)

    res.status(200).json({ updatedData })
  } catch (err) {
    res.status(500).json({ message: `Error updating inventory item`})
  }
}

module.exports = {
  inventoryWarehouseList,
  postInventoryItem,
  updateInventoryItem,
};