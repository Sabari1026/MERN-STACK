/**
 * Admin Company Verification Routes for HireConnect
 * Exposes administrative review queue and verification status update endpoints.
 */

const express = require('express');
const adminCompanyController = require('../controllers/adminCompany.controller');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// All administrative verification endpoints strictly enforce platform admin role
router.use(authenticate, requireRole('admin'));

router.get('/', adminCompanyController.listRequests);
router.get('/:id', adminCompanyController.getRequestDetails);
router.patch('/:id', adminCompanyController.reviewRequest);

module.exports = router;
