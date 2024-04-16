const express = require('express');
const cors = require('cors');
const app = express();

//Routers here ↓↓↓

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

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on ${PORT}`);
});