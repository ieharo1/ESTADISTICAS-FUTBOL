const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'futstats-secret-key-2024';

const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
};

exports.protect = (req, res, next) => {
  let token = getTokenFromHeader(req);

  if (!token) {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(401).json({ message: 'No autorizado. Inicia sesión.' });
    }
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    return res.redirect('/auth/login');
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
  }
};
