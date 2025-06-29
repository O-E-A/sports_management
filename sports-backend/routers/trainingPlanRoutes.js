const express = require('express')
const router = express.Router()
const TrainingPlan = require('../models/trainingPlan')

router.get('/', async (req, res) => {
  try {
    const trainings = await TrainingPlan.find()
    res.json(trainings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
// PUT: İdman yoklama giriş/güncelleme
router.put('/:id/attendance', async (req, res) => {
  try {
    const { attendanceNotes } = req.body;

    // Katılan oyuncuları listeden al (id'leri array olarak tutacağız)
    const participants = Object.keys(attendanceNotes);

    const updated = await TrainingPlan.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          participants,
          attendanceNotes,
        },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const newTraining = new TrainingPlan(req.body)
    const saved = await newTraining.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
