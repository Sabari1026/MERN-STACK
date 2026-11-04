const express = require('express');
const { getHealth, getLiveness, getReadiness, getEmailHealth, sendTestEmail } = require('../controllers/health.controller');

const router = express.Router();

router.get('/', getHealth);
router.get('/live', getLiveness);
router.get('/ready', getReadiness);
router.get('/email', getEmailHealth);
router.post('/email/test', sendTestEmail);

module.exports = router;
