const profileRoutes = require('./routers/profileRoutes')
const teamRoutes = require('./routers/teamRoutes')
const matchRoutes = require('./routers/matchRoutes')
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

const matchStatsRoutes = require('./routers/matchStatsRoutes')
const matchSummaryRoutes = require('./routers/matchSummaryRoutes')
const trainingPlanRoutes = require('./routers/trainingPlanRoutes')

const inventoryRoutes = require('./routers/inventoryRoutes')
const announcementRoutes = require('./routers/announcementRoutes')

app.use('/api/inventory', inventoryRoutes)
app.use('/api/announcements', announcementRoutes)

app.use('/api/match-stats', matchStatsRoutes)
app.use('/api/match-summary', matchSummaryRoutes)
app.use('/api/training-plans', trainingPlanRoutes)

app.use('/api/profiles', profileRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/matches', matchRoutes)

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı başarılı')
    app.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`))
  })
  .catch(err => console.error('❌ MongoDB bağlantı hatası:', err))
