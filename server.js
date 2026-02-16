require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB, seedIfEmpty } = require('./config/db');
const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { createAdmin } = require('./controllers/authController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', webRoutes);
app.use('/api', apiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'No encontrado',
    message: 'La página solicitada no existe.',
    statusCode: 404
  });
});

app.use((error, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(error);
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }

  return res.status(500).render('error', {
    title: 'Error interno',
    message: 'Ha ocurrido un error inesperado.',
    statusCode: 500
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await seedIfEmpty();
    await createAdmin();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
