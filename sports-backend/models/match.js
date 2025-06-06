const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
  date: Date,
  location: String,
  opponent: String,
  note: String
})

module.exports = mongoose.model('Match', matchSchema, 'match')
