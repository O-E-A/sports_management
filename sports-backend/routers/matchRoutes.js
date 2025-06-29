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

router.post('/', async (req, res) => {
  try {
    const newMatch = new Match(req.body)
    const saved = await newMatch.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
module.exports = router
