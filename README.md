# Inventory Management System

This project is a backend API built with Node.js and MongoDB for managing inventory, suppliers, bulk operations (CSV export/import), and low stock alerts.

## Features

### Inventory Management API:

CRUD operations for managing inventory items.
Supplier management with CRUD operations.
Linking suppliers to inventory items.

### Bulk Operations:

Export inventory data as CSV.
Import inventory data from CSV in bulk.

### Low Stock Alerts:

Monitor and alert when inventory items fall below the low stock threshold.

## Environment Variables

MONGO_URI = mongodb+srv://rjparsana8:AVKlr7WBX8pEDSN0@cluster0.ujmuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

PORT = 3000

## API Endpoints

### Inventory Management
#### Create Inventory Item:
POST /inventory

#### Get All Inventory Items:
GET /inventory

#### Update Inventory Item:
PUT /inventory/:id

#### Delete Inventory Item:
DELETE /inventory/:id

### Supplier Management
#### Create Supplier:
POST /supplier

#### Get All Suppliers:
GET /supplier

#### Update Supplier:
PUT /supplier/:id

#### Delete Supplier:
DELETE /supplier/:id

### Low Stock Alerts
#### Get Low Stock Items:
GET /inventory/low-stock

## Usage
node server.js

## CSV Import/Export
### Export Inventory as CSV
Endpoint:
GET /inventory/export

### Import Inventory from CSV
Endpoint:
POST /inventory/import

## Low Stock Alerts
The low stock alert system monitors inventory and identifies items with quantity below the lowStockThreshold.

Endpoint:
GET /inventory/low-stock


