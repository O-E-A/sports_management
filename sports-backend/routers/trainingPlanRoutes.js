const express = require('express')
const router = express.Router()
const TrainingPlan = require('../models/trainingPlan')

router.get('/', async (req, res) => {
  try {
    const trainings = await TrainingPlan.find()
    res.json(trainings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
