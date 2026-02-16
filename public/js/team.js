const teamSelect = document.getElementById('teamSelect');
const teamMetrics = document.getElementById('teamMetrics');
const formDisplay = document.getElementById('formDisplay');

const trendChart = echarts.init(document.getElementById('trendChart'));
const heatmapChart = echarts.init(document.getElementById('heatmapChart'));

const metricBlock = (title, value, sub = '') => `
  <div class="col-6 col-lg-3">
    <div class="card p-3 h-100">
      <div class="muted small">${title}</div>
      <div class="metric-value">${value}</div>
      <small class="muted">${sub}</small>
    </div>
  </div>
`;

const renderTeam = (team) => {
  teamMetrics.innerHTML = [
    metricBlock('Goles anotados', team.goalsFor),
    metricBlock('Goles recibidos', team.goalsAgainst),
    metricBlock('Posesión promedio', `${team.possessionAvg}%`),
    metricBlock('Efectividad', `${Math.round(team.efficiency * 100)}%`),
    metricBlock('Tiros al arco', team.shotsOnTargetAvg),
    metricBlock('xG simulado', team.xg),
    metricBlock('Índice defensivo', team.defensiveIndex),
    metricBlock('Eficiencia ofensiva', team.offensiveEfficiency)
  ].join('');

  formDisplay.innerHTML = team.form
    .map((result) => {
      const styles = result === 'W' ? 'bg-success' : result === 'L' ? 'bg-danger' : 'bg-secondary';
      return `<span class="badge ${styles}">${result}</span>`;
    })
    .join('');

  trendChart.setOption({
    xAxis: { type: 'category', data: team.performanceTrend.map((_, i) => `J${i + 1}`) },
    yAxis: { type: 'value' },
    tooltip: { trigger: 'axis' },
    series: [{ type: 'line', smooth: true, data: team.performanceTrend, areaStyle: {}, itemStyle: { color: '#2f80ed' } }]
  });

  const indicators = ['Posesión', 'Tiros', 'Efectividad', 'xG', 'Defensa'];
  const values = [team.possessionAvg, team.shotsOnTargetAvg * 10, team.efficiency * 100, team.xg * 40, team.defensiveIndex];

  heatmapChart.setOption({
    xAxis: { type: 'category', data: indicators },
    yAxis: { type: 'category', data: [team.name] },
    visualMap: { min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0 },
    series: [
      {
        type: 'heatmap',
        data: values.map((value, index) => [index, 0, Math.min(100, Math.round(value))]),
        label: { show: true }
      }
    ]
  });
};

const loadTeam = async (teamId) => {
  const response = await fetch(`/api/teams/${teamId}`);
  const payload = await response.json();
  renderTeam(payload.data);
};

teamSelect.addEventListener('change', (event) => loadTeam(event.target.value));

window.addEventListener('resize', () => {
  trendChart.resize();
  heatmapChart.resize();
});

loadTeam(teamSelect.value);
