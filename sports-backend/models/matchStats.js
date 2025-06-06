const mongoose = require('mongoose')

const matchStatsSchema = new mongoose.Schema({
  matchId: mongoose.Schema.Types.ObjectId,
  playerId: mongoose.Schema.Types.ObjectId,
  rushingYards: Number,
  passingYards: Number,
  tackles: Number,
  interceptions: Number,
  sacks: Number,
  passAttempts: Number,
  passCompletions: Number,
  touchdowns: Number,
  notes: String
})

module.exports = mongoose.model('MatchStats', matchStatsSchema, 'matchStats')
