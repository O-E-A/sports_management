// sports-backend/routes/profileRoutes.js

const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')
const mongoose = require('mongoose') // Mongoose'u dahil etmeyi unutmayın

// Rota 1: Belirli bir kullanıcıya ait profili getir (Profilim sayfası için)
router.get('/:userId', async (req, res) => {
  try {
    const userIdFromParams = req.params.userId;

    // Konsolda parametreyi kontrol edelim
    console.log('Backend Profile Route - Received userId:', userIdFromParams);

    // userId'nin geçerli bir ObjectId olup olmadığını kontrol edin.
    // Eğer veritabanında userId'yi string olarak saklıyorsanız bu kontrolü kaldırabilirsiniz.
    if (!mongoose.Types.ObjectId.isValid(userIdFromParams)) {
      console.log('Backend Profile Route - Invalid ObjectId format for userId:', userIdFromParams);
      // Eğer kullanıcının _id'si Object ID olarak kayıtlı ise ve burada hata alıyorsanız,
      // büyük ihtimalle front-end'den gelen user.id doğru Object ID formatında değildir.
      // Ya da profiles koleksiyonunuzdaki userId alanı String olarak kaydedilmiştir.
      return res.status(400).json({ message: 'Geçersiz kullanıcı ID formatı.' });
    }

    // profiller koleksiyonundaki userId alanını, gelen ObjectId ile eşleştir.
    // MongoDB Atlas'taki profiles koleksiyonunuzdaki userId alanının "ObjectId" tipinde
    // ve "users" koleksiyonundaki kullanıcının "_id"si ile aynı değeri içerdiğinden EMİN OLUN.
    const profile = await Profile.findOne({ userId: new mongoose.Types.ObjectId(userIdFromParams) });

    if (!profile) {
      console.log('Backend Profile Route - Profile not found for userId:', userIdFromParams);
      return res.status(404).json({ message: 'Profil bulunamadı. Lütfen profiles koleksiyonundaki userId alanının, users koleksiyonundaki kullanıcının _id\'si ile eşleştiğinden emin olun.' });
    }

    console.log('Backend Profile Route - Profile found:', profile);
    res.json(profile);
  } catch (err) {
    console.error('Backend Profile Route - Error fetching profile:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Rota 2: Tüm profilleri getir (Oyuncular Listesi için)
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find(); // Tüm profilleri getir

    if (!profiles || profiles.length === 0) {
      console.log('Backend PlayerList Route - No profiles found.');
      return res.status(404).json({ message: 'Hiç profil bulunamadı.' });
    }

    console.log('Backend PlayerList Route - Profiles found:', profiles.length);
    res.json(profiles);
  } catch (err) {
    console.error('Backend PlayerList Route - Error fetching all profiles:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;