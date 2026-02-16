const compareTeamsSelect = document.getElementById('compareTeams');
const compareBtn = document.getElementById('compareBtn');
const compareResults = document.getElementById('compareResults');

const advancedRadar = echarts.init(document.getElementById('advancedRadar'));
const compareBar = echarts.init(document.getElementById('compareBar'));
const leagueLine = echarts.init(document.getElementById('leagueLine'));
const possessionScatter = echarts.init(document.getElementById('possessionScatter'));
const defenseAttack = echarts.init(document.getElementById('defenseAttack'));

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

const colorPalette = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const selectedIds = () => Array.from(compareTeamsSelect.selectedOptions).map((option) => option.value);

const renderCompare = (teams) => {
  compareResults.style.display = 'block';
  
  setTimeout(() => {
    advancedRadar.resize();
    compareBar.resize();
    possessionScatter.resize();
    defenseAttack.resize();
  }, 100);
  
  advancedRadar.setOption({
    tooltip: { backgroundColor: chartColors.bg, borderColor: chartColors.primary, textStyle: { color: chartColors.text } },
    legend: { data: teams.map((team) => team.name), textStyle: { color: chartColors.text }, bottom: 0 },
    radar: {
      indicator: [
        { name: 'xG', max: 3 },
        { name: 'Ofensiva', max: 100 },
        { name: 'Defensiva', max: 100 },
        { name: 'Posesión', max: 100 },
        { name: 'Efectividad', max: 100 }
      ],
      axisName: { color: chartColors.textMuted },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [{
      type: 'radar',
      data: teams.map((team, idx) => ({
        name: team.name,
        value: [team.xg, team.offensiveEfficiency, team.defensiveIndex, team.possessionAvg, team.efficiency * 100],
        itemStyle: { color: colorPalette[idx % colorPalette.length] },
        areaStyle: { opacity: 0.15 }
      }))
    }]
  }, true);

  compareBar.setOption({
    tooltip: { trigger: 'axis', backgroundColor: chartColors.bg, borderColor: chartColors.primary, textStyle: { color: chartColors.text } },
    legend: { data: ['Goles a favor', 'Efectividad %'], textStyle: { color: chartColors.text }, bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: teams.map((team) => team.name),
      axisLabel: { color: chartColors.textMuted, rotate: 15 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: [
      { 
        type: 'value', 
        name: 'Goles',
        axisLabel: { color: chartColors.textMuted },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
      },
      { 
        type: 'value', 
        name: 'Efectividad %',
        axisLabel: { color: chartColors.textMuted },
        splitLine: { show: false }
      }
    ],
    series: [
      { 
        name: 'Goles a favor', 
        type: 'bar', 
        data: teams.map((team) => ({
          value: team.goalsFor,
          itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: chartColors.primary }, { offset: 1, color: chartColors.secondary }]), borderRadius: [4, 4, 0, 0] }
        }))
      },
      { 
        name: 'Efectividad %', 
        type: 'line', 
        yAxisIndex: 1,
        data: teams.map((team) => Math.round(team.efficiency * 100)),
        lineStyle: { color: chartColors.success, width: 3 },
        itemStyle: { color: chartColors.success },
        symbol: 'circle',
        symbolSize: 10
      }
    ]
  }, true);

  possessionScatter.setOption({
    tooltip: { 
      trigger: 'item',
      backgroundColor: chartColors.bg,
      borderColor: chartColors.primary,
      textStyle: { color: chartColors.text },
      formatter: (params) => `${params.data[2]}<br/>Posesión: ${params.data[0]}%<br/>Tiros: ${params.data[1]}`
    },
    grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
    xAxis: { 
      type: 'value',
      name: 'Posesión %',
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    yAxis: { 
      type: 'value',
      name: 'Tiros al Arco',
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      type: 'scatter',
      symbolSize: (data) => Math.sqrt(data[0]) * 3,
      data: teams.map((team, idx) => ({
        value: [team.possessionAvg, team.shotsOnTargetAvg * 10, team.name],
        itemStyle: { color: colorPalette[idx % colorPalette.length] }
      })),
      emphasis: { scale: 1.5 }
    }]
  }, true);

  defenseAttack.setOption({
    tooltip: { 
      trigger: 'item',
      backgroundColor: chartColors.bg,
      borderColor: chartColors.primary,
      textStyle: { color: chartColors.text }
    },
    grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
    xAxis: { 
      type: 'value',
      name: 'Ataque (Goles)',
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    yAxis: { 
      type: 'value',
      name: 'Defensa ( GC)',
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      type: 'scatter',
      symbolSize: (data) => Math.sqrt(data[2]) * 3,
      data: teams.map((team, idx) => ({
        value: [team.goalsFor, team.goalsAgainst, team.points, team.name],
        itemStyle: { color: colorPalette[idx % colorPalette.length] }
      })),
      emphasis: { scale: 1.5 }
    }]
  }, true);
};

const loadLeagueComparison = async () => {
  try {
    const response = await fetch('/api/leagues');
    const payload = await response.json();

    const lines = payload.data.map((leagueData) => {
      const avgXg = leagueData.standings.reduce((acc, team) => acc + (team.points / team.played), 0) / leagueData.standings.length;
      return {
        league: leagueData.league,
        xgSimulado: Number((avgXg / 1.5).toFixed(2))
      };
    });

    leagueLine.setOption({
      tooltip: { trigger: 'axis', backgroundColor: chartColors.bg, borderColor: chartColors.primary, textStyle: { color: chartColors.text } },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: lines.map((item) => item.league),
        axisLabel: { color: chartColors.textMuted, rotate: 20 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      yAxis: { 
        type: 'value', 
        name: 'xG promedio',
        axisLabel: { color: chartColors.textMuted },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
      },
      series: [{
        type: 'line',
        smooth: true,
        data: lines.map((item) => item.xgSimulado),
        lineStyle: { color: chartColors.info, width: 3 },
        itemStyle: { color: chartColors.info },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
            { offset: 1, color: 'rgba(6, 182, 212, 0)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 10
      }]
    }, true);
  } catch (error) {
    console.error('Error loading league comparison:', error);
  }
};

const runCompare = async () => {
  const ids = selectedIds();
  if (ids.length < 2) {
    alert('Selecciona al menos 2 equipos para comparar.');
    return;
  }

  try {
    const response = await fetch(`/api/compare?ids=${ids.join(',')}`);
    const payload = await response.json();
    renderCompare(payload.data);
  } catch (error) {
    console.error('Error comparing teams:', error);
  }
};

compareBtn.addEventListener('click', runCompare);

window.addEventListener('resize', () => {
  advancedRadar.resize();
  compareBar.resize();
  leagueLine.resize();
  possessionScatter.resize();
  defenseAttack.resize();
});

loadLeagueComparison();
