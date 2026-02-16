require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');
const { seedTeams } = require('../config/seedData');

const runSeed = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI en .env');

    await mongoose.connect(process.env.MONGODB_URI);
    await Team.deleteMany({});
    await Team.insertMany(seedTeams);
    // eslint-disable-next-line no-console
    console.log(`Seed ejecutado: ${seedTeams.length} equipos insertados.`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en seed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

runSeed();
