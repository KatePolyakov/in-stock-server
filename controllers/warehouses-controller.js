const knex = require('knex')(require('../knexfile'));
const { isValidEmail, isValidPhone } = require("../utils/validator");

const index = async (_req, res) => {
  try {
    const data = await knex('warehouses');
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Users: ${err}`)
  }
}
const singleWarehouse = async (req, res) => {
  try {
    const warehouseFound = await knex('warehouses')
      .where({ id: req.params.warehouse_id })
      .first();

    if (!warehouseFound) {
      return res.status(404).json({
        message: `warehouse with ID ${req.params.warehouse_id} not found`
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
  const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;
  const errors = [];

  if (!warehouse_name) {
    errors.push("Missing required field: warehouse_name");
  }
  if (!address) {
    errors.push("Missing required field: address");
  }
  if (!city) {
    errors.push("Missing required field: city");
  }
  if (!country) {
    errors.push("Missing required field: country");
  }
  if (!contact_name) {
    errors.push("Missing required field: contact_name");
  }
  if (!contact_position) {
    errors.push("Missing required field: contact_position");
  }
  if (!contact_phone) {
    errors.push("Missing required field: contact_phone");
  } else if (!isValidPhone(contact_phone)) {
    errors.push("Invalid phone number format for contact_phone");
  }
  if (!contact_email) {
    errors.push("Missing required field: contact_email");
  } else if (!isValidEmail(contact_email)) {
    errors.push("Invalid email format for contact_email");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const result = await knex('warehouses')
      .insert(
        req.body
      );
    const newWarehouseId = result[0];

    const createdWarehouse = await knex('warehouses')
      .where({ id: newWarehouseId })
      .first();

    res.status(201).json(createdWarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new Warehouse: ${error}`,
    });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const rowsDeleted = await knex("warehouses")
      .where({ id: req.params.warehouse_id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.warehouse_id} not found` });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete Warehouse: ${error}`
    });
  }
};

module.exports = {
  index,
  singleWarehouse,
  postWarehouse,
  deleteWarehouse
}