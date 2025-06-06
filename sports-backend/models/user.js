const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String,
  role: String,
  createdAt: Date
})

module.exports = mongoose.model('User', userSchema)
