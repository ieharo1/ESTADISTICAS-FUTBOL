const express = require('express');
const {
  renderDashboard,
  renderTeamView,
  renderCompareView
} = require('../controllers/pageController');

const router = express.Router();

router.get('/', renderDashboard);
router.get('/equipo', renderTeamView);
router.get('/comparativa', renderCompareView);

module.exports = router;
