const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt:{
    type: Date,
    default: Date.now
}
})

module.exports = mongoose.model('Announcement', announcementSchema, 'announcement')
