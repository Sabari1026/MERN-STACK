const express = require('express');
const { getHealth, getLiveness, getReadiness, getEmailHealth } = require('../controllers/health.controller');

const router = express.Router();

router.get('/', getHealth);
router.get('/live', getLiveness);
router.get('/ready', getReadiness);
router.get('/email', getEmailHealth);

module.exports = router;
