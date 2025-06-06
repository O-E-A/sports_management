const mongoose = require('mongoose')

const trainingPlanSchema = new mongoose.Schema({
  date: Date,
  location: String,
  participants: [mongoose.Schema.Types.ObjectId],
  coachNote: String,
  attendanceNotes: mongoose.Schema.Types.Mixed // { [playerId]: "Açıklama" }
})

module.exports = mongoose.model('TrainingPlan', trainingPlanSchema, 'trainingPlan')
