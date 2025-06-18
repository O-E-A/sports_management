//////////////sports-backend\routers\inventoryRoutes.js//
const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory'); // Model dosyanızın yolu doğru olmalı

// Mevcut kodunuz: Tüm envanteri getir
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// YENİ EKLENECEK KOD: Yeni envanter öğesi oluştur
router.post('/', async (req, res) => {
  // Frontend'den gönderilecek verileri alıyoruz
  const { itemName, quantity, status } = req.body;

  // Yeni bir Inventory nesnesi oluşturuyoruz
  const newItem = new Inventory({
    itemName,
    quantity,
    status,
    // lastUpdated varsayılan olarak güncel tarihi alır (modelde tanımlıysa)
  });

  try {
    // Yeni öğeyi veritabanına kaydediyoruz
    const savedItem = await newItem.save();
    // Başarılı olursa 201 (Created) status kodu ve kaydedilen öğeyi geri gönderiyoruz
    res.status(201).json(savedItem);
  } catch (err) {
    // Hata olursa 400 (Bad Request) kodu ve hata mesajını gönderiyoruz
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;