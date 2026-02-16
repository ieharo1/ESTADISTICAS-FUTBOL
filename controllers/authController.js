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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, provider: 'local' });
    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Usuario desactivado' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
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

    res.status(201).json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada' });
};

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@futstats.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Administrator',
        email: 'admin@futstats.com',
        password: 'admin123',
        role: 'admin',
        provider: 'local'
      });
      await admin.save();
      console.log('Usuario admin creado: admin@futstats.com / admin123');
    }
  } catch (error) {
    console.error('Error al crear admin:', error);
  }
};

module.exports = {
  login,
  register,
  logout,
  createAdmin
};
