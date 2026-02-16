const Team = require('../models/Team');

const leagueOverview = (teams) => {
  const totalGoals = teams.reduce((acc, team) => acc + team.goalsFor, 0);
  const totalMatches = teams.reduce((acc, team) => acc + team.played, 0) / 2;
  const avgGoals = totalMatches > 0 ? totalGoals / totalMatches : 0;

  const bestAttack = [...teams].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  const bestDefense = [...teams].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];

  return {
    totalTeams: teams.length,
    totalGoals,
    avgGoalsPerMatch: Number(avgGoals.toFixed(2)),
    bestAttack: bestAttack ? bestAttack.name : null,
    bestDefense: bestDefense ? bestDefense.name : null
  };
};

const standingsForLeague = (teams) => {
  return [...teams]
    .sort((a, b) => {
      const pointDiff = b.points - a.points;
      if (pointDiff !== 0) return pointDiff;
      return b.goalDifference - a.goalDifference;
    })
    .map((team, index) => ({
      position: index + 1,
      id: team._id,
      name: team.name,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
      points: team.points,
      possessionAvg: team.possessionAvg,
      shotsOnTargetAvg: team.shotsOnTargetAvg
    }));
};

const getLeaguesSummary = async (req, res, next) => {
  try {
    const teams = await Team.find().lean({ virtuals: true });
    const grouped = teams.reduce((acc, team) => {
      if (!acc[team.league]) acc[team.league] = [];
      acc[team.league].push(team);
      return acc;
    }, {});

    const summary = Object.entries(grouped).map(([league, leagueTeams]) => ({
      league,
      overview: leagueOverview(leagueTeams),
      standings: standingsForLeague(leagueTeams)
    }));

    res.json({ data: summary });
  } catch (error) {
    next(error);
  }
};

const getLeagueDetail = async (req, res, next) => {
  try {
    const { league } = req.params;
    const teams = await Team.find({ league }).lean({ virtuals: true });

    if (!teams.length) {
      return res.status(404).json({ message: 'Liga no encontrada.' });
    }

    res.json({
      league,
      overview: leagueOverview(teams),
      standings: standingsForLeague(teams)
    });
  } catch (error) {
    next(error);
  }
};

const getTeamDetail = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).lean({ virtuals: true });

    if (!team) {
      return res.status(404).json({ message: 'Equipo no encontrado.' });
    }

    res.json({ data: team });
  } catch (error) {
    next(error);
  }
};

const compareTeams = async (req, res, next) => {
  try {
    const ids = (req.query.ids || '').split(',').filter(Boolean);

    if (ids.length < 2) {
      return res.status(400).json({ message: 'Debe enviar al menos 2 equipos para comparar.' });
    }

    const teams = await Team.find({ _id: { $in: ids } }).lean({ virtuals: true });

    if (teams.length < 2) {
      return res.status(404).json({ message: 'No se encontraron suficientes equipos para comparar.' });
    }

    res.json({ data: teams });
  } catch (error) {
    next(error);
  }
};

const getTeamsCatalog = async (req, res, next) => {
  try {
    const teams = await Team.find().select('name league country').lean();
    res.json({ data: teams });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaguesSummary,
  getLeagueDetail,
  getTeamDetail,
  compareTeams,
  getTeamsCatalog
};
