const leagueSelect = document.getElementById('leagueSelect');
const overviewCards = document.getElementById('overviewCards');
const standingsTableBody = document.querySelector('#standingsTable tbody');

const goalsBar = echarts.init(document.getElementById('goalsBar'));
const radarChart = echarts.init(document.getElementById('radarChart'));
const pointsPie = echarts.init(document.getElementById('pointsPie'));

const metricCard = (title, value, subtitle) => `
  <div class="col-12 col-md-6 col-xl-3">
    <div class="card p-3 h-100">
      <span class="muted small">${title}</span>
      <div class="metric-value">${value}</div>
      <small class="muted">${subtitle || ''}</small>
    </div>
  </div>
`;

const renderOverview = (overview) => {
  overviewCards.innerHTML = [
    metricCard('Goles Totales', overview.totalGoals, 'en la liga seleccionada'),
    metricCard('Promedio por partido', overview.avgGoalsPerMatch, 'goles por encuentro'),
    metricCard('Mejor ataque', overview.bestAttack, 'más goles a favor'),
    metricCard('Mejor defensa', overview.bestDefense, 'menos goles recibidos')
  ].join('');
};

const renderStandings = (standings) => {
  standingsTableBody.innerHTML = standings
    .map(
      (team) => `
      <tr>
        <td>${team.position}</td><td>${team.name}</td><td>${team.played}</td><td>${team.won}</td>
        <td>${team.drawn}</td><td>${team.lost}</td><td>${team.goalsFor}</td><td>${team.goalsAgainst}</td>
        <td>${team.goalDifference}</td><td><strong>${team.points}</strong></td>
      </tr>
    `
    )
    .join('');
};

const renderCharts = (standings) => {
  goalsBar.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: standings.map((t) => t.name), axisLabel: { rotate: 30 } },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: standings.map((t) => t.goalsFor), itemStyle: { color: '#2f80ed' } }]
  });

  const topFive = standings.slice(0, 5);
  radarChart.setOption({
    legend: { textStyle: { color: '#e9eef7' } },
    radar: {
      indicator: [
        { name: 'Puntos', max: Math.max(...topFive.map((t) => t.points)) + 5 },
        { name: 'GF', max: Math.max(...topFive.map((t) => t.goalsFor)) + 10 },
        { name: 'Defensa', max: 100 },
        { name: 'Posesión', max: 100 },
        { name: 'Tiros a puerta', max: 10 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: topFive.map((team) => ({
          value: [team.points, team.goalsFor, 100 - team.goalsAgainst, team.possessionAvg, team.shotsOnTargetAvg],
          name: team.name
        }))
      }
    ]
  });

  pointsPie.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        data: standings.map((team) => ({ name: team.name, value: team.points }))
      }
    ]
  });
};

const loadLeague = async (league) => {
  const response = await fetch(`/api/leagues/${encodeURIComponent(league)}`);
  const data = await response.json();

  renderOverview(data.overview);
  renderStandings(data.standings);
  renderCharts(data.standings);
};

leagueSelect.addEventListener('change', (event) => {
  loadLeague(event.target.value);
});

window.addEventListener('resize', () => {
  goalsBar.resize();
  radarChart.resize();
  pointsPie.resize();
});

loadLeague(leagueSelect.value);
