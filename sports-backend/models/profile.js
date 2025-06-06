const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  age: Number,
  height: Number,
  weight: Number,
  position: String,
  teamId: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('Profile', profileSchema)
