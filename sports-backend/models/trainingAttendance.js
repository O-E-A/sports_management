// models/trainingAttendance.js
const mongoose = require('mongoose')

const TrainingAttendanceSchema = new mongoose.Schema({
  trainingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingPlan',
    required: true,
  },
  participants: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
      note: {
        type: String,
      },
    },
  ],
})

module.exports = mongoose.model('TrainingAttendance', TrainingAttendanceSchema)
