const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplier');
const { Parser } = require('json2csv');
const multer = require('multer');
const csvParser = require('csv-parser');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

// Create Supplier
router.post('/', async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Supplier
router.put('/:id', async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSupplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Supplier
router.delete('/:id', async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/export', async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier');
    const fields = ['name', 'quantity', 'supplier.name'];
    const parser = new Parser({ fields });
    const csv = parser.parse(items);
    res.header('Content-Type', 'text/csv');
    res.attachment('inventory.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/import', upload.single('file'), (req, res) => {
  const items = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => items.push(data))
    .on('end', async () => {
      try {
        await Inventory.insertMany(items);
        res.json({ message: 'Inventory imported successfully.' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
});

router.get('/low-stock', async (req, res) => {
    const items = await Inventory.find({ quantity: { $lt: '$lowStockThreshold' } });
    res.json(items);
  });
  

module.exports = router;