const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const inventoryRoutes = require('./routes/inventory');
const supplierRoutes = require('./routes/supplier');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  app.get('/', (req, res) => {
    res.send('Inventory Management App is running...');
});

app.use(bodyParser.json());
app.use('/inventory', inventoryRoutes);
app.use('/supplier', supplierRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

