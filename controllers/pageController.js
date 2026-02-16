const Team = require('../models/Team');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'futstats-secret-key-2024';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const renderDashboard = async (req, res, next) => {
  try {
    const leagues = await Team.distinct('league');
    const user = { name: req.user?.name || 'Usuario' };
    res.render('dashboard', { title: 'Dashboard General', leagues, user });
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

const renderLogin = (req, res) => {
  res.render('login', { title: 'Iniciar Sesión', error: null, success: null });
};

const renderRegister = (req, res) => {
  res.render('register', { title: 'Registrarse', error: null });
};

const renderProfile = (req, res) => {
  res.render('perfil', { title: 'Mi Perfil', user: req.user });
};

const renderAdmin = (req, res) => {
  res.render('admin', { title: 'Administración', user: req.user });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};

module.exports = {
  renderDashboard,
  renderTeamView,
  renderCompareView,
  renderLogin,
  renderRegister,
  renderProfile,
  renderAdmin,
  logout
};
