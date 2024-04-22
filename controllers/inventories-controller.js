const knex = require('knex')(require('../knexfile'));
const { isValidInventoryData } = require('../utils/validator');

const getOneInventory = async (req, res) => {
  try {
    const oneInventory = await knex('inventories').where({ id: req.params.inventoryId }).first();

    if (!oneInventory) {
      return res.status(404).json({
        message: `inventory with ID ${req.params.inventoryId} not found`,
      });
    }
    res.status(200).json(oneInventory);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve data for inventory with ID ${req.params.inventoryId} error: ${error}`,
    });
  }
};

const inventoryWarehouseList = async (req, res) => {
  try {
    const { sort_by, order_by, s } = req.query;
    let query = knex
      .select(
        'inventories.id',
        'inventories.item_name',
        'inventories.description',
        'inventories.category',
        'inventories.status',
        'inventories.quantity',
        'warehouses.warehouse_name as warehouse_name',
      )
      .from('inventories')
      .join('warehouses', 'inventories.warehouse_id', 'warehouses.id');

    if (sort_by && typeof sort_by === 'string' && sort_by.trim() !== '') {
      query = query.orderBy(sort_by, order_by || 'asc');
    }

    if (s) {
      const searchTerm = `%${s}%`;
      query = query.where(function () {
        this.where('inventories.item_name', 'like', searchTerm)
          .orWhere('inventories.description', 'like', searchTerm)
          .orWhere('inventories.category', 'like', searchTerm)
          .orWhere('inventories.status', 'like', searchTerm)
          .orWhere('warehouses.warehouse_name', 'like', searchTerm);
      });
    }

    const data = await query;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: `Error getting the list` });
  }
};

const postInventoryItem = async (req, res) => {
  const errors = await isValidInventoryData(req, res);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const postData = req.body;
  try {
    const data = await knex('inventories').insert(postData);
    const newInventoryItem = data[0];
    const createdInventoryItem = await knex('inventories').where({ id: newInventoryItem }).first();

    res.status(201).json({ createdInventoryItem });
  } catch (err) {
    res.status(500).json({ message: `Error creating the inventory item` });
  }
};

const updateInventoryItem = async (req, res) => {
  const errors = await isValidInventoryData(req, res);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const { inventoryId } = req.params;
  const putData = req.body;
  try {
    const updatedData = await knex('inventories').where({ id: inventoryId }).update(putData);

    res.status(200).json({ updatedData });
  } catch (err) {
    res.status(500).json({ message: `Error updating inventory item` });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const rowsDeleted = await knex('inventories').where({ id: req.params.inventoryId }).delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Inventories with ID ${req.params.inventoryId} not found` });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete Inventory: ${error}`,
    });
  }
};

module.exports = {
  inventoryWarehouseList,
  postInventoryItem,
  updateInventoryItem,
  getOneInventory,
  deleteInventory,
};
