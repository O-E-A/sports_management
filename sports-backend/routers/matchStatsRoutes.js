const express = require('express')
const router = express.Router()
const MatchStats = require('../models/matchStats')

router.get('/', async (req, res) => {
  try {
    const stats = await MatchStats.find()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
