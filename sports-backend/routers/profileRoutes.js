const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

// Belirli bir kullanıcıya ait profil
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId })

    if (!profile) {
      return res.status(404).json({ message: 'Profil bulunamadı' })
    }

    res.json(profile)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


module.exports = router
