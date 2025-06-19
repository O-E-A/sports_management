// sports-backend/routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
// İsterseniz burada kimlik doğrulama middleware'ı ekleyebilirsiniz
// const authMiddleware = require('../middleware/auth'); // Örneğin, bir auth middleware'ınız varsa

// Yeni duyuru oluşturma rotası
// Bu rota, sadece belirli yetkilere sahip kullanıcılar tarafından çağrılmalı (koç/admin gibi)
// Eğer authMiddleware'iniz varsa şöyle kullanabilirsiniz:
// router.post('/', authMiddleware.verifyToken, authMiddleware.authorizeRoles(['admin', 'coach']), announcementController.createAnnouncement);
router.post('/', announcementController.createAnnouncement);

// Tüm duyuruları getirme rotası
router.get('/', announcementController.getAnnouncements);

// Diğer duyuru rotaları (isteğe bağlı olarak eklenebilir)
// router.get('/:id', announcementController.getAnnouncementById);
// router.put('/:id', announcementController.updateAnnouncement);
// router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;