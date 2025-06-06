const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  name: String,
  branch: String,
  createdBy: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('Team', teamSchema, 'team')
