const knex = require('knex')(require('../knexfile'));

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


module.exports = {
  index,
  singleWarehouse
}