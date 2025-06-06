const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Örnek kullanıcı router'ı
const userRoutes = require('./routers/userRoutes')
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı başarılı')
    app.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`))
  })
  .catch(err => console.error('❌ MongoDB bağlantı hatası:', err))
