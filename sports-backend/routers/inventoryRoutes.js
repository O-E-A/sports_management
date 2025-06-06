const express = require('express')
const router = express.Router()
const Inventory = require('../models/inventory')

router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
