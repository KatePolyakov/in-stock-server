const knex = require('knex')(require('../knexfile'));
const { isValidEmail, isValidPhone } = require('../utils/validator');

const index = async (req, res) => {
  try {
    const { sort_by, order_by } = req.query;
    let query = knex('warehouses');
    if (sort_by && typeof sort_by === 'string' && sort_by.trim() !== '') {
      query = query.orderBy(sort_by, order_by || 'asc');
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

const postWarehouse = async (req, res) => {
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
  const errors = [];

  if (!warehouse_name) {
    errors.push('Missing required field: warehouse_name');
  }
  if (!address) {
    errors.push('Missing required field: address');
  }
  if (!city) {
    errors.push('Missing required field: city');
  }
  if (!country) {
    errors.push('Missing required field: country');
  }
  if (!contact_name) {
    errors.push('Missing required field: contact_name');
  }
  if (!contact_position) {
    errors.push('Missing required field: contact_position');
  }
  if (!contact_phone) {
    errors.push('Missing required field: contact_phone');
  } else if (!isValidPhone(contact_phone)) {
    errors.push('Invalid phone number format for contact_phone');
  }
  if (!contact_email) {
    errors.push('Missing required field: contact_email');
  } else if (!isValidEmail(contact_email)) {
    errors.push('Invalid email format for contact_email');
  }
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
const update = async (req, res) => {
  try {
    const rowsUpdated = await knex('user').where({ id: req.params.id }).update(req.body);

    //chexk if anything was updatd or found
    if (!rowsUpdated) {
      // equal to rowsupdated === 0
      return res.status(404).json({
        message: `User with ID ${req.params.id} not found`,
      });
    }

    //get anupdated record
    const updatedUser = await knex('user').where({ id: req.params.id });

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update user with ID ${req.params.id}: ${error}`,
    });
  }
};

const inventories = async (req, res) => {
  try {
    //Check if warehouse is in table
    const foundWarehouse = await knex('warehouses').where({ id: req.params.warehouse_id });

    if (!foundWarehouse.length) {
      return res.status(404).json({ message: 'Warehouse was not found' });
    }

    //Use found warehouse id to return inventory list
    const warehouseInventories = await knex('inventories')
      .where({
        warehouse_id: foundWarehouse[0].id,
      })
      .select('*');
    //Return 400 if inventory list empty
    if (warehouseInventories.length === 0) {
      res.status(500).json({ message: 'Warehouse is empty!' });
      //Otherwise return inventory list
    } else {
      res.status(200).json(warehouseInventories);
    }
    //Error Handling
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
};
