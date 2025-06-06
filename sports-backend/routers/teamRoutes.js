const express = require('express')
const router = express.Router()
const Team = require('../models/team')

router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
    res.json(teams)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
