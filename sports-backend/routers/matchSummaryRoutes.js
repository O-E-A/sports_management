const express = require('express')
const router = express.Router()
const MatchSummary = require('../models/matchSummary')

router.get('/', async (req, res) => {
  try {
    const summary = await MatchSummary.find()
    res.json(summary)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
