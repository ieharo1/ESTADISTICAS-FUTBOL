const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'futstats-secret-key-2024';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, provider: 'local' });
    if (!user) {
      return res.render('login', { title: 'Iniciar Sesión', error: 'Email o contraseña incorrectos', success: null });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { title: 'Iniciar Sesión', error: 'Email o contraseña incorrectos', success: null });
    }

    if (!user.isActive) {
      return res.render('login', { title: 'Iniciar Sesión', error: 'Usuario desactivado', success: null });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.redirect('/');
  } catch (error) {
    res.render('login', { title: 'Iniciar Sesión', error: 'Error al iniciar sesión', success: null });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { title: 'Registrarse', error: 'El email ya está registrado' });
    }

    const user = new User({
      name,
      email,
      password,
      provider: 'local'
    });

    await user.save();

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.redirect('/');
  } catch (error) {
    res.render('register', { title: 'Registrarse', error: 'Error al registrar usuario' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

router.get('/google', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión', error: 'Google Authcoming soon', success: null });
});

router.get('/facebook', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión', error: 'Facebook Authcoming soon', success: null });
});

router.get('/twitter', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión', error: 'Twitter Authcoming soon', success: null });
});

router.get('/apple', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión', error: 'Apple Authcoming soon', success: null });
});

module.exports = router;
