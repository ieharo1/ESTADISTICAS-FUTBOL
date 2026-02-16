const express = require('express');
const {
  renderDashboard,
  renderTeamView,
  renderCompareView,
  renderLogin,
  renderRegister,
  renderProfile,
  logout
} = require('../controllers/pageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/auth/login', renderLogin);
router.get('/auth/register', renderRegister);
router.get('/auth/logout', logout);

router.get('/perfil', protect, renderProfile);
router.get('/', protect, renderDashboard);
router.get('/equipo', protect, renderTeamView);
router.get('/comparativa', protect, renderCompareView);

module.exports = router;
