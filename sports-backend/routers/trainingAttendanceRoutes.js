// routes/trainingAttendanceRoutes.js
const express = require('express');
const router = express.Router();
const TrainingAttendance = require('../models/trainingAttendance');

// ✅ 1. Yeni yoklama oluştur
router.post('/', async (req, res) => {
  try {
    const attendance = new TrainingAttendance(req.body);
    const saved = await attendance.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ 2. Belirli idmana ait yoklamayı getir (populate ile oyuncuları getir)
router.get('/:trainingId', async (req, res) => {
  try {
    const data = await TrainingAttendance.findOne({ trainingId: req.params.trainingId })
      .populate('participants.playerId');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ 3. Yoklama zaten varsa üzerine güncelleme (participant listesi)
router.put('/:trainingId', async (req, res) => {
  try {
    const updated = await TrainingAttendance.findOneAndUpdate(
      { trainingId: req.params.trainingId },
      { participants: req.body.participants },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;