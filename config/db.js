const mongoose = require('mongoose');
const Team = require('../models/Team');
const { seedTeams } = require('./seedData');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI no está definido en el entorno.');
  }

  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log('MongoDB conectada correctamente.');
};

const seedIfEmpty = async () => {
  const count = await Team.countDocuments();
  if (count > 0) return;

  await Team.insertMany(seedTeams);
  // eslint-disable-next-line no-console
  console.log(`Seed inicial completado: ${seedTeams.length} equipos cargados.`);
};

module.exports = { connectDB, seedIfEmpty };
