// sports-backend/controllers/announcementController.js
const Announcement = require('../models/announcement'); // Model adı 'announcement' olmalı
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

// Telegram bot token ve chat ID'yi .env dosyasından alıyoruz
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Botu sadece TELEGRAM_BOT_TOKEN tanımlıysa başlat (hata almamak için)
let bot;
if (TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
} else {
  console.warn('TELEGRAM_BOT_TOKEN ortam değişkeni tanımlı değil. Telegram botu başlatılamadı.');
}

// Yeni duyuru oluşturma
exports.createAnnouncement = async (req, res) => {
  // Frontend'den gelecek title, content ve author (kullanıcının ID'si)
  const { title, content, author } = req.body;

  // Temel doğrulama
  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Başlık, içerik ve yazar bilgisi zorunludur.' });
  }

  try {
    // 1. Duyuruyu MongoDB'ye kaydet
    const newAnnouncement = new Announcement({
      title,
      content,
      author,
    });
    await newAnnouncement.save();

    // 2. Duyuruyu Telegram grubuna gönder (sadece bot ve chat ID tanımlıysa)
    if (bot && TELEGRAM_CHAT_ID) {
      // Telegram mesajı için MarkdownV2 formatı kullanıyoruz.
      // MarkdownV2'de özel karakterlerin ( _, *, [, ], (, ), ~, `, >, #, +, -, =, |, {, }, ., ! ) escape edilmesi gerekir.
      const telegramMessageRaw = `*Yeni Duyuru: ${title}*\n\n${content}\n\n_Bu duyuru uygulamanızdan gönderilmiştir._`;

      // Özel karakterleri escape eden yardımcı fonksiyon
      const escapeMarkdownV2 = (text) => {
        return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
      };

      const telegramMessage = escapeMarkdownV2(telegramMessageRaw);

      try {
        await bot.sendMessage(TELEGRAM_CHAT_ID, telegramMessage, { parse_mode: 'MarkdownV2' });
        console.log('Duyuru Telegram grubuna başarıyla gönderildi.');
      } catch (telegramError) {
        console.error('Telegram\'a mesaj gönderilirken hata oluştu:', telegramError.message);
        // Debug için hata detaylarını görmek isterseniz:
        // if (telegramError.response && telegramError.response.body) {
        //   console.error('Telegram Hata Detayları:', telegramError.response.body);
        // }
      }
    } else {
      console.warn('Telegram botu veya chat ID tanımlı değil. Duyuru Telegram\'a gönderilemedi.');
    }

    // Başarılı yanıt gönder
    res.status(201).json({
      message: 'Duyuru başarıyla oluşturuldu ve Telegram\'a gönderildi.',
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error('Duyuru oluşturulurken hata:', error);
    res.status(500).json({ message: 'Duyuru oluşturulurken sunucu hatası oluştu.' });
  }
};

// Tüm duyuruları getirme (mevcut GET rotası için)
exports.getAnnouncements = async (req, res) => {
  try {
    // Duyuruları en yeniden eskiye doğru sırala
    // author alanını User modelinden ilgili bilgilerle populate edebilirsiniz (örn: username)
    const announcements = await Announcement.find().populate('author', 'username').sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Duyurular getirilirken hata:', error);
    res.status(500).json({ message: 'Duyurular getirilirken sunucu hatası oluştu.' });
  }
};

// Diğer CRUD işlemleri (isteğe bağlı, şimdilik sadece oluşturma ve getirme odaklıyız)
// exports.getAnnouncementById = async (req, res) => { ... }
// exports.updateAnnouncement = async (req, res) => { ... }
// exports.deleteAnnouncement = async (req, res) => { ... }