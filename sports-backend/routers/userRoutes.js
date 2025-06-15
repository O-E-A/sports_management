const express = require('express')
const router = express.Router()
const User = require('../models/user')

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    // 1. Kullanıcı adı ile kullanıcıyı bul
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
    }

    // 2. Şifre karşılaştır (şifre hash'li değilse doğrudan karşılaştırılır)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Şifre yanlış' })
    }

    // 3. Giriş başarılıysa kullanıcı bilgilerini gönder
    res.status(200).json({
      message: 'Giriş başarılı',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
