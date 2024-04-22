const knex = require('knex')(require('../knexfile'));

const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

 const isValidPhone = (phone) => {
  const usCanadaRegex = /^(\+?1\s?)?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
  const internationalRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
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
    quantity, 
  } = req.body
  const errors = []
  if (!warehouse_id || !item_name || !description || !category || !status || quantity < 0) {
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

const isValidWarehouseData = (data) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = data;
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
  
  return errors;
};


module.exports = {
  isValidEmail,
  isValidPhone,
  isValidInventoryData,
  isValidWarehouseData
};