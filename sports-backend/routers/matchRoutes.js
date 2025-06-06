const express = require('express')
const router = express.Router()
const Match = require('../models/match')

router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
    res.json(matches)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
