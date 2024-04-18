const knex = require('knex')(require('../knexfile'));

const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

const isValidPhone = (phone) => {
  const usCanadaRegex = /^\+?1\s?\(\d{3}\)\s?\d{3}-\d{4}$/;
  const internationalRegex = /^\+\d{1,2}\s?\d{3,}\s?\d{3,}$/;
  const indiaRegex = /^[6-9]\d{9}$/;

  if (usCanadaRegex.test(phone) || internationalRegex.test(phone) || indiaRegex.test(phone)) {
    return true;
  } else {
    return false;
  }
}

const isValidInventoryData = async (req, res) => {
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
  return errors
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidInventoryData,
};