const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const User = require('../models/user'); // User modelini de dahil ediyoruz

//================================================================
// YENİ EKLENEN ROTA: Yeni bir oyuncu oluştur (User + Profile)
//================================================================
router.post('/', async (req, res) => {
  // Frontend'den gönderilen tüm verileri alıyoruz
  const {
    username, password, email, phone,
    firstName, lastName, age, height, weight, position, teamId
  } = req.body;

  // Gerekli alanların dolu olup olmadığını kontrol et
  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Kullanıcı adı, şifre, ad ve soyad alanları zorunludur.' });
  }

  try {
    // 1. ADIM: KULLANICI OLUŞTURMA
    // Bu kullanıcı adının daha önce alınıp alınmadığını kontrol et
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
    }

    // Yeni bir 'User' nesnesi oluştur
    const newUser = new User({
      username,
      password, // Talebiniz üzerine şifre hash'lenmeden kaydediliyor
      email,
      phone,
      role: req.body.role || 'player', // frontend'den gelen 'role' bilgisini kullan, gelmezse varsayılan 'player' yap
    });

    // Yeni kullanıcıyı 'users' koleksiyonuna kaydet
    const savedUser = await newUser.save();

    // 2. ADIM: PROFİL OLUŞTURMA
    // Yeni bir 'Profile' nesnesi oluştur
    const newProfile = new Profile({
      userId: savedUser._id, // <<<--- İŞİN EN ÖNEMLİ KISMI: Oluşturulan kullanıcının ID'sini bağlıyoruz
      firstName,
      lastName,
      age,
      height,
      weight,
      position,
      teamId: teamId || null // Takım ID'si gönderilmediyse null olarak ayarla
    });

    // Yeni profili 'profiles' koleksiyonuna kaydet
    await newProfile.save();

    res.status(201).json({ message: 'Oyuncu başarıyla oluşturuldu!' });

  } catch (error) {
    console.error("Oyuncu oluşturma hatası:", error);
    // Burada bir hata olursa, idealde yukarıda oluşturulan 'savedUser' kaydının da silinmesi gerekir.
    res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
  }
});


//================================================================
// MEVCUT ROTALARINIZ (DEĞİŞİKLİK YOK)
//================================================================

// Rota 1: Belirli bir kullanıcıya ait profili getir (Profilim sayfası için)
router.get('/:userId', async (req, res) => {
  try {
    const userIdFromParams = req.params.userId;
    console.log('Backend Profile Route - Received userId:', userIdFromParams);

    if (!mongoose.Types.ObjectId.isValid(userIdFromParams)) {
      console.log('Backend Profile Route - Invalid ObjectId format for userId:', userIdFromParams);
      return res.status(400).json({ message: 'Geçersiz kullanıcı ID formatı.' });
    }

    const profile = await Profile.findOne({ userId: new mongoose.Types.ObjectId(userIdFromParams) });

    if (!profile) {
      console.log('Backend Profile Route - Profile not found for userId:', userIdFromParams);
      return res.status(404).json({ message: 'Profil bulunamadı.' });
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
    const profiles = await Profile.find();

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