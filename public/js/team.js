const teamSelect = document.getElementById('teamSelect');

const trendChart = echarts.init(document.getElementById('trendChart'));
const heatmapChart = echarts.init(document.getElementById('heatmapChart'));
const gaugeChart = echarts.init(document.getElementById('gaugeChart'));
const xgCompareChart = echarts.init(document.getElementById('xgCompareChart'));
const attributesRadar = echarts.init(document.getElementById('attributesRadar'));

const chartColors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  bg: '#1a2234'
};

const renderTeam = (team) => {
  document.getElementById('goalsFor').textContent = team.goalsFor;
  document.getElementById('goalsAgainst').textContent = team.goalsAgainst;
  document.getElementById('possession').textContent = `${team.possessionAvg}%`;
  document.getElementById('efficiency').textContent = `${Math.round(team.efficiency * 100)}%`;
  document.getElementById('shotsOnTarget').textContent = team.shotsOnTargetAvg;
  document.getElementById('xg').textContent = team.xg;
  document.getElementById('defensiveIndex').textContent = team.defensiveIndex;
  document.getElementById('offensiveEfficiency').textContent = team.offensiveEfficiency;

  let wins = 0, draws = 0, losses = 0;
  const formContainer = document.getElementById('formDisplay');
  formContainer.innerHTML = team.form.map((result) => {
    if (result === 'W') wins++;
    else if (result === 'D') draws++;
    else losses++;
    
    const styles = result === 'W' ? 'bg-success' : result === 'L' ? 'bg-danger' : 'bg-secondary';
    return `<span class="badge ${styles} fs-6 px-3 py-2">${result}</span>`;
  }).join('');
  
  document.getElementById('formWins').textContent = `${wins}V`;
  document.getElementById('formDraws').textContent = `${draws}E`;
  document.getElementById('formLosses').textContent = `${losses}P`;

  trendChart.setOption({
    tooltip: { trigger: 'axis', backgroundColor: chartColors.bg, borderColor: chartColors.primary, textStyle: { color: chartColors.text } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: team.performanceTrend.map((_, i) => `J${i + 1}`),
      axisLabel: { color: chartColors.textMuted },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: team.performanceTrend,
      lineStyle: { color: chartColors.primary, width: 3 },
      itemStyle: { color: chartColors.primary },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
          { offset: 1, color: 'rgba(99, 102, 241, 0)' }
        ])
      },
      symbol: 'circle',
      symbolSize: 8,
      animationDuration: 1500
    }]
  }, true);

  const indicators = ['Posesión', 'Tiros', 'Efectividad', 'xG', 'Defensa'];
  const values = [team.possessionAvg, team.shotsOnTargetAvg * 10, team.efficiency * 100, team.xg * 40, team.defensiveIndex];

  heatmapChart.setOption({
    tooltip: { position: 'top', backgroundColor: chartColors.bg, borderColor: chartColors.primary, textStyle: { color: chartColors.text } },
    grid: { left: '15%', right: '10%', top: '10%', bottom: '15%' },
    xAxis: { 
      type: 'category', 
      data: indicators,
      axisLabel: { color: chartColors.textMuted },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: { 
      type: 'category', 
      data: [team.name],
      axisLabel: { color: chartColors.textMuted },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      textStyle: { color: chartColors.textMuted },
      inRange: { color: [chartColors.bg, chartColors.primary, chartColors.success] }
    },
    series: [{
      type: 'heatmap',
      data: values.map((value, index) => [index, 0, Math.min(100, Math.round(value))]),
      label: { show: true, color: '#fff', fontSize: 14, fontWeight: 'bold' },
      itemStyle: {
        borderRadius: 4,
        borderColor: chartColors.bg,
        borderWidth: 2
      },
      animationDelay: (idx) => idx * 200
    }]
  }, true);

  const efficiency = Math.round(team.efficiency * 100);
  gaugeChart.setOption({
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: chartColors.danger }, { offset: 0.5, color: chartColors.warning }, { offset: 1, color: chartColors.success }]) },
      progress: { show: true, width: 20, roundCap: true },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 20, color: [[1, 'rgba(255,255,255,0.1)']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        fontSize: 36,
        offsetCenter: [0, '30%'],
        valueAnimation: true,
        formatter: '{value}%',
        color: chartColors.text,
        fontWeight: 'bold'
      },
      data: [{ value: efficiency }]
    }]
  }, true);

  const xgValue = team.xg * 40;
  xgCompareChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: chartColors.bg, borderColor: chartColors.primary, textStyle: { color: chartColors.text } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: ['Goles Reales', 'Expected Goals (xG)'],
      axisLabel: { color: chartColors.textMuted },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [
      {
        name: 'Goles',
        type: 'bar',
        data: [{ value: team.goalsFor, itemStyle: { color: chartColors.success, borderRadius: [4, 4, 0, 0] } }],
        barWidth: '40%'
      },
      {
        name: 'xG',
        type: 'bar',
        data: [{ value: xgValue, itemStyle: { color: chartColors.info, borderRadius: [4, 4, 0, 0] } }],
        barWidth: '40%'
      }
    ]
  }, true);

  attributesRadar.setOption({
    tooltip: { backgroundColor: chartColors.bg, borderColor: chartColors.primary, textStyle: { color: chartColors.text } },
    legend: { data: [team.name], textStyle: { color: chartColors.text }, bottom: 0 },
    radar: {
      indicator: [
        { name: 'Ataque', max: 100 },
        { name: 'Defensa', max: 100 },
        { name: 'Posesión', max: 100 },
        { name: 'Tiros', max: 100 },
        { name: 'Creatividad', max: 100 },
        { name: 'Consistencia', max: 100 }
      ],
      axisName: { color: chartColors.textMuted },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [team.offensiveEfficiency, team.defensiveIndex, team.possessionAvg, team.shotsOnTargetAvg * 10, team.xg * 30, team.efficiency * 100],
        name: team.name,
        itemStyle: { color: chartColors.primary },
        areaStyle: { color: 'rgba(99, 102, 241, 0.2)' }
      }]
    }]
  }, true);
};

const loadTeam = async (teamId) => {
  try {
    const response = await fetch(`/api/teams/${teamId}`);
    const payload = await response.json();
    renderTeam(payload.data);
  } catch (error) {
    console.error('Error loading team data:', error);
  }
};

teamSelect.addEventListener('change', (event) => loadTeam(event.target.value));

window.addEventListener('resize', () => {
  trendChart.resize();
  heatmapChart.resize();
  gaugeChart.resize();
  xgCompareChart.resize();
  attributesRadar.resize();
});

loadTeam(teamSelect.value);
