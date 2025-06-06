const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: Date
})

module.exports = mongoose.model('Announcement', announcementSchema, 'announcement')
