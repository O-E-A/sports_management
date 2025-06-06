const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  itemName: String,
  quantity: Number,
  status: String, // örnek: 'good', 'damaged', 'missing'
  lastUpdated: Date
})

module.exports = mongoose.model('Inventory', inventorySchema, 'inventory')
