const Team = require('../models/Team');

const renderDashboard = async (req, res, next) => {
  try {
    const leagues = await Team.distinct('league');
    res.render('dashboard', { title: 'Dashboard General', leagues });
  } catch (error) {
    next(error);
  }
};

const renderTeamView = async (req, res, next) => {
  try {
    const teams = await Team.find().select('name league').lean();
    res.render('team', { title: 'Vista por Equipo', teams });
  } catch (error) {
    next(error);
  }
};

const renderCompareView = async (req, res, next) => {
  try {
    const teams = await Team.find().select('name league').lean();
    const leagues = await Team.distinct('league');
    res.render('compare', { title: 'Comparativa Avanzada', teams, leagues });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderDashboard,
  renderTeamView,
  renderCompareView
};
