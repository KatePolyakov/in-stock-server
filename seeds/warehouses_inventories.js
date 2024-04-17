/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const warehousesData = require('../seed-data/warehouses');
const inventoriesData = require('../seed-data/inventories');

exports.seed = async function(knex) {
  await knex('inventories').del();
  await knex('warehouses').del();
  await knex('warehouses').insert(warehousesData);
  await knex('inventories').insert(inventoriesData);
};