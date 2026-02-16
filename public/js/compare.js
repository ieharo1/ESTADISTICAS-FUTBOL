const compareTeamsSelect = document.getElementById('compareTeams');
const compareBtn = document.getElementById('compareBtn');

const advancedRadar = echarts.init(document.getElementById('advancedRadar'));
const compareBar = echarts.init(document.getElementById('compareBar'));
const leagueLine = echarts.init(document.getElementById('leagueLine'));

const selectedIds = () => Array.from(compareTeamsSelect.selectedOptions).map((option) => option.value);

const renderCompare = (teams) => {
  advancedRadar.setOption({
    legend: { data: teams.map((team) => team.name), textStyle: { color: '#e9eef7' } },
    radar: {
      indicator: [
        { name: 'xG', max: 3 },
        { name: 'Ofensiva', max: 100 },
        { name: 'Defensiva', max: 100 },
        { name: 'Posesión', max: 100 },
        { name: 'Efectividad', max: 100 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: teams.map((team) => ({
          name: team.name,
          value: [team.xg, team.offensiveEfficiency, team.defensiveIndex, team.possessionAvg, team.efficiency * 100]
        }))
      }
    ]
  });

  compareBar.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['Goles a favor', 'Efectividad %'], textStyle: { color: '#e9eef7' } },
    xAxis: { type: 'category', data: teams.map((team) => team.name) },
    yAxis: [{ type: 'value' }, { type: 'value' }],
    series: [
      { name: 'Goles a favor', type: 'bar', data: teams.map((team) => team.goalsFor) },
      { name: 'Efectividad %', type: 'line', yAxisIndex: 1, data: teams.map((team) => Math.round(team.efficiency * 100)) }
    ]
  });
};

const loadLeagueComparison = async () => {
  const response = await fetch('/api/leagues');
  const payload = await response.json();

  const lines = payload.data.map((leagueData) => {
    const avgXg =
      leagueData.standings.reduce((acc, team) => acc + (team.points / team.played), 0) /
      leagueData.standings.length;

    return {
      league: leagueData.league,
      xgSimulado: Number((avgXg / 1.5).toFixed(2))
    };
  });

  leagueLine.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: lines.map((item) => item.league), axisLabel: { rotate: 20 } },
    yAxis: { type: 'value', name: 'xG promedio' },
    series: [{ type: 'line', smooth: true, data: lines.map((item) => item.xgSimulado), itemStyle: { color: '#00c2ff' } }]
  });
};

const runCompare = async () => {
  const ids = selectedIds();
  if (ids.length < 2) {
    alert('Selecciona al menos 2 equipos para comparar.');
    return;
  }

  const response = await fetch(`/api/compare?ids=${ids.join(',')}`);
  const payload = await response.json();
  renderCompare(payload.data);
};

compareBtn.addEventListener('click', runCompare);

window.addEventListener('resize', () => {
  advancedRadar.resize();
  compareBar.resize();
  leagueLine.resize();
});

loadLeagueComparison();
