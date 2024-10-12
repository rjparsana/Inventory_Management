const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const { Parser } = require('json2csv');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const Supplier = require('../models/supplier');
const upload = multer({ dest: 'uploads/' });


// Create Inventory Item with Supplier Link
router.post('/', async (req, res) => {
  try {
    const { name, quantity, supplierId, lowStockThreshold } = req.body;
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const inventory = new Inventory({
      name,
      quantity,
      lowStockThreshold,
      supplier: supplierId, 
    });

    await inventory.save();
    res.status(201).json(inventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Inventory Items with Supplier Info
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier', 'name contact');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Inventory Item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Inventory Item
router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CSV Export Route
router.get('/export', async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier', 'name');
    
    const fields = ['name', 'quantity', 'lowStockThreshold', 'supplier.name'];
    const parser = new Parser({ fields });
    
    const csv = parser.parse(items);  
    res.header('Content-Type', 'text/csv');
    res.attachment('inventory.csv'); 
    res.send(csv);  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CSV Import Route
router.post('/import', upload.single('file'), (req, res) => { 
  const items = [];

  // Read and parse the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => items.push(data))
    .on('end', async () => {
      try {
        await Inventory.insertMany(items);  
        res.json({ message: 'Inventory imported successfully!' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      } finally {
        fs.unlinkSync(req.file.path);  
      }
    });
});

// Get Low Stock Items
router.get('/low-stock', async (req, res) => {
  try {
    
    const lowStockItems = await Inventory.find().populate('supplier', 'name contact'); 

    res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
