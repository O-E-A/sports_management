const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { // <-- Burayı 'author' olarak değiştirdik
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User modeline referans veriyoruz
    required: true // Yazarın zorunlu olması gerektiğini belirttik
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Announcement', announcementSchema, 'announcement')
