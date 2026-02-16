const express = require('express');
const {
  getLeaguesSummary,
  getLeagueDetail,
  getTeamDetail,
  compareTeams,
  getTeamsCatalog
} = require('../controllers/apiController');

const router = express.Router();

router.get('/leagues', getLeaguesSummary);
router.get('/leagues/:league', getLeagueDetail);
router.get('/teams', getTeamsCatalog);
router.get('/teams/:id', getTeamDetail);
router.get('/compare', compareTeams);

module.exports = router;
