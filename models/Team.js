const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    league: { type: String, required: true, index: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    played: { type: Number, required: true },
    won: { type: Number, required: true },
    drawn: { type: Number, required: true },
    lost: { type: Number, required: true },
    goalsFor: { type: Number, required: true },
    goalsAgainst: { type: Number, required: true },
    possessionAvg: { type: Number, required: true },
    shotsOnTargetAvg: { type: Number, required: true },
    efficiency: { type: Number, required: true },
    form: [{ type: String, enum: ['W', 'D', 'L'] }],
    xg: { type: Number, required: true },
    offensiveEfficiency: { type: Number, required: true },
    defensiveIndex: { type: Number, required: true },
    performanceTrend: [{ type: Number }]
  },
  { timestamps: true }
);

teamSchema.virtual('points').get(function points() {
  return this.won * 3 + this.drawn;
});

teamSchema.virtual('goalDifference').get(function goalDifference() {
  return this.goalsFor - this.goalsAgainst;
});

teamSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Team', teamSchema);
