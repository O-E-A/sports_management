//sports-backend\routers\matchSummaryRoutes.js
const express = require("express");
const router = express.Router();
const MatchSummary = require("../models/matchSummary");

router.get("/", async (req, res) => {
  try {
    const summary = await MatchSummary.find();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Yeni maç özeti ekleme
router.post("/", async (req, res) => {
  try {
    const {
      matchId,
      totalRushingYards,
      totalPassingYards,
      totalTackles,
      totalInterceptions,
      totalTouchdowns,
      scoreUs,
      scoreOpponent,
    } = req.body;

    const newSummary = new MatchSummary({
      matchId,
      totalRushingYards,
      totalPassingYards,
      totalTackles,
      totalInterceptions,
      totalTouchdowns,
      scoreUs,
      scoreOpponent,
    });

    const saved = await newSummary.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// ID ile maç özetini sil
router.delete('/:id', async (req, res) => {
  try {
    const result = await MatchSummary.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ message: 'Kayıt bulunamadı' })
    res.json({ message: 'Silindi' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
module.exports = router;
