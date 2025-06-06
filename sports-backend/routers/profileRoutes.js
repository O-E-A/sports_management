const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find()
    res.json(profiles)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
