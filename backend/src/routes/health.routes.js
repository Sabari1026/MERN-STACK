const express = require('express');
const {
  getHealth,
  getLiveness,
  getReadiness,
  getEmailHealth,
  sendTestEmail,
  flushEmailOutbox
} = require('../controllers/health.controller');

const router = express.Router();

router.get('/', getHealth);
router.get('/live', getLiveness);
router.get('/ready', getReadiness);
router.get('/email', getEmailHealth);
router.post('/email/test', sendTestEmail);
router.post('/email/outbox/process', flushEmailOutbox);

module.exports = router;
