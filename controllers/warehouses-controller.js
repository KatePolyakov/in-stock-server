const knex = require('knex')(require('../knexfile'));
const { isValidWarehouseData } = require('../utils/validator');

const index = async (req, res) => {
  try {
    const { sort_by, order_by, s } = req.query;
    let query = knex('warehouses');
    if (sort_by && typeof sort_by === 'string' && sort_by.trim() !== '') {
      query = query.orderBy(sort_by, order_by || 'asc');
    }
    if (s) {
      const searchTerm = `%${s}%`;
      query = query.where(function () {
        this.where('warehouse_name', 'like', searchTerm)
          .orWhere('address', 'like', searchTerm)
          .orWhere('city', 'like', searchTerm)
          .orWhere('country', 'like', searchTerm)
          .orWhere('contact_name', 'like', searchTerm)
          .orWhere('contact_email', 'like', searchTerm)
          .orWhere('contact_phone', 'like', searchTerm);
      });
    }
    const data = await query;
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
};
const singleWarehouse = async (req, res) => {
  try {
    const warehouseFound = await knex('warehouses').where({ id: req.params.warehouse_id }).first();

    if (!warehouseFound) {
      return res.status(404).json({
        message: `warehouse with ID ${req.params.warehouse_id} not found`,
      });
    }
    res.status(200).json(warehouseFound);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve data for warehouse with ID ${req.params.warehouse_id} error: ${error}`,
    });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const rowsDeleted = await knex('warehouses').where({ id: req.params.warehouse_id }).delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.warehouse_id} not found` });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete Warehouse: ${error}`,
    });
  }
};

const postWarehouse = async (req, res) => {
  const errors = isValidWarehouseData(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const result = await knex('warehouses').insert(req.body);
    const newWarehouseId = result[0];

    const createdWarehouse = await knex('warehouses').where({ id: newWarehouseId }).first();

    res.status(201).json(createdWarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new Warehouse: ${error}`,
    });
  }
};

const updateWarehouse = async (req, res) => {
  const errors = isValidWarehouseData(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  try {
    const rowsUpdated = await knex('warehouses')
      .where({ id: req.params.warehouse_id })
      .update({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      });
    if (!rowsUpdated) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.warehouse_id} not found`,
      });
    }
    const updatedWarehouse = await knex('warehouses').where({ id: req.params.warehouse_id }).first();
    res.status(200).json(updatedWarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update Warehouse with ID ${req.params.warehouse_id}: ${error}`,
    });
  }
};

const inventories = async (req, res) => {
  try {
    const foundWarehouse = await knex('warehouses').where({ id: req.params.warehouse_id });

    if (!foundWarehouse.length) {
      return res.status(404).json({ message: 'Warehouse was not found' });
    }
    const warehouseInventories = await knex('inventories')
      .where({
        warehouse_id: foundWarehouse[0].id,
      })
      .select('*');
    if (warehouseInventories.length === 0) {
      res.status(500).json({ message: 'Warehouse is empty!' });
    } else {
      res.status(200).json(warehouseInventories);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  index,
  singleWarehouse,
  postWarehouse,
  deleteWarehouse,
  inventories,
  updateWarehouse
};
