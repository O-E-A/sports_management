//sports-backend\models\matchSummary.js
const mongoose = require('mongoose')

const matchSummarySchema = new mongoose.Schema({
  matchId: mongoose.Schema.Types.ObjectId,
  totalRushingYards: Number,
  totalPassingYards: Number,
  totalTackles: Number,
  totalInterceptions: Number,
  totalTouchdowns: Number,
  scoreUs: Number,
  scoreOpponent: Number
})

module.exports = mongoose.model('MatchSummary', matchSummarySchema, 'matchSummary')
