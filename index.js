const express = require('express');
const cors = require('cors');
const app = express();

//Routers here ↓↓↓
const warehousesRoutes = require('./routes/warehouses-routes');
const inventoriesRoutes = require('./routes/inventories-routes');
// process.env contains the .env variables
require('dotenv').config();
const PORT = process.env.PORT;

// CORS middleware to allow requests from any origin (any other server)
app.use(cors());

// Use JSON middleware so that I can use req.body
app.use(express.json());

//basic 
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api', warehousesRoutes);

app.use('/api', inventoriesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on ${PORT}`);
});