const express = require("express");

const router = express.Router();

const PDFDocument = require("pdfkit");

const Inventory = require("../models/inventory");

const Profile = require("../models/profile"); // Düzeltildi: ../models.profile -> ../models/profile

const Team = require("../models/team"); // Eklendi: PDF başlığı için gerekli

const path = require("path");

// =================================================================

// ROTA 1: Tüm envanter öğelerini listele (Mevcut kodunuz)

// GET /api/inventory

// =================================================================

router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find();

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =================================================================

// ROTA 2: Yeni bir envanter öğesi oluştur

// POST /api/inventory

// =================================================================

router.post("/", async (req, res) => {
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

    res.status(201).json(savedItem);
  } catch (err) {
    // Hata olursa 400 (Bad Request) kodu ve hata mesajını gönderiyoruz
    res.status(400).json({ message: err.message });
  }
});

const fontPath = path.join(__dirname, "../", "fonts", "Roboto-Regular.ttf");

// =================================================================

// ROTA 3: Envanter listesini PDF olarak dışa aktar

// GET /api/inventory/export-pdf/:userId

// =================================================================

router.get("/export-pdf/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // 1. GEREKLİ VERİLERİ VERİTABANINDAN ÇEK

    const inventoryItems = await Inventory.find({}).sort({ itemName: 1 }); // Alfabetik sırala // Kullanıcının profilini ve takım adını çek

    const userProfile = await Profile.findOne({ userId: userId });

    if (!userProfile) {
      return res

        .status(404)

        .json({ message: "PDF oluşturmak için kullanıcı profili bulunamadı." });
    } // Takım adını al (eğer teamId varsa)

    let teamName = "Takım Belirtilmemiş";

    if (userProfile.teamId) {
      const team = await Team.findById(userProfile.teamId);

      if (team) teamName = team.name;
    }

    const downloaderName = `${userProfile.firstName} ${userProfile.lastName}`; // 2. PDF OLUŞTURMA SÜRECİNİ BAŞLAT

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",

      `attachment; filename="envanter-raporu.pdf"`
    );

    doc.pipe(res); // 3. PDF İÇERİĞİNİ OLUŞTUR // Başlık

    doc.fontSize(18).font("Helvetica-Bold").text(teamName, { align: "center" });

    doc

      .fontSize(14)

      .font("Helvetica")

      .text("Envanter Raporu", { align: "center" });

    doc.moveDown(2); // Tablo Başlıkları

    const tableTop = doc.y;

    const itemX = 50;

    const quantityX = 350;

    const statusX = 450;

    doc.fontSize(11).font("Helvetica-Bold");

    doc.text("Ürün Adı", itemX, tableTop);

    doc.text("Adet", quantityX, tableTop);

    doc.text("Durum", statusX, tableTop);

    doc.moveTo(itemX, doc.y).lineTo(545, doc.y).stroke(); // Başlık altı çizgisi

    doc.moveDown(0.5); // Tablo İçeriği

    doc.fontSize(10).font("Helvetica");

    inventoryItems.forEach((item) => {
      const currentY = doc.y;

      doc.text(item.itemName, itemX, currentY, { width: 280 }); // Genişlik vererek uzun isimlerin aşağı kaymasını sağla

      doc.text(String(item.quantity), quantityX, currentY);

      doc.text(item.status, statusX, currentY);

      doc.moveDown(1); // Satırlar arası boşluk
    }); // Alt Bilgi (Footer)

    doc

      .fontSize(8)

      .font("Helvetica-Oblique")

      .text(
        `Bu rapor, ${downloaderName} tarafindan ${new Date().toLocaleDateString(
          "tr-TR"
        )} tarihinde olusturulmustur.`,

        50,

        750, // Sayfanın en altı

        { align: "center", lineBreak: false }
      ); // 4. PDF'i BİTİR

    doc.end();
  } catch (error) {
    console.error("PDF oluşturma hatası:", error);

    res.status(500).json({ message: "PDF oluşturulurken bir hata oluştu." });
  }
});

//öğe silme işlemi için rota 
/**
 * @route   DELETE /api/inventory/:id
 * @desc    Belirli bir envanter öğesini siler
 * @access  Private (Coach veya Admin olmalı)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ID'ye göre öğeyi bul ve veritabanından sil
    const deletedItem = await Inventory.findByIdAndDelete(id);

    // Eğer o ID'ye sahip bir öğe bulunamazsa
    if (!deletedItem) {
      return res.status(404).json({ message: 'Silinecek öğe bulunamadı.' });
    }

    // Başarılı olursa
    res.status(200).json({ message: 'Öğe başarıyla silindi.' });

  } catch (error) {
    console.error('Silme işlemi sırasında sunucu hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});
module.exports = router;