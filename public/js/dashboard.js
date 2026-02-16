const leagueSelect = document.getElementById('leagueSelect');
const overviewCards = document.getElementById('overviewCards');
const standingsTableBody = document.querySelector('#standingsTable tbody');

const goalsBar = echarts.init(document.getElementById('goalsBar'));
const radarChart = echarts.init(document.getElementById('radarChart'));
const pointsPie = echarts.init(document.getElementById('pointsPie'));
const pointsLine = echarts.init(document.getElementById('pointsLine'));
const goalDiffChart = echarts.init(document.getElementById('goalDiffChart'));

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

const renderOverview = (overview) => {
  document.getElementById('totalGoals').textContent = overview.totalGoals;
  document.getElementById('avgGoals').textContent = overview.avgGoalsPerMatch;
  document.getElementById('bestAttack').textContent = overview.bestAttack;
  document.getElementById('bestDefense').textContent = overview.bestDefense;
  document.getElementById('leagueBadge').textContent = leagueSelect.value;
};

const renderStandings = (standings) => {
  standingsTableBody.innerHTML = standings
    .map(
      (team, index) => {
        const positionClass = index < 4 ? 'text-success' : index >= standings.length - 3 ? 'text-danger' : '';
        return `
        <tr class="animate-fade-in" style="animation-delay: ${index * 0.05}s">
          <td class="position ${positionClass}">${team.position}</td>
          <td class="team-name">
            <span class="team-badge" style="background: linear-gradient(135deg, ${chartColors.primary}, ${chartColors.secondary}); width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">${team.name.substring(0, 2).toUpperCase()}</span>
            <span>${team.name}</span>
          </td>
          <td>${team.played}</td>
          <td><span class="badge badge-w">${team.won}</span></td>
          <td><span class="badge badge-d">${team.drawn}</span></td>
          <td><span class="badge badge-l">${team.lost}</span></td>
          <td>${team.goalsFor}</td>
          <td>${team.goalsAgainst}</td>
          <td class="${team.goalDifference > 0 ? 'text-success' : team.goalDifference < 0 ? 'text-danger' : ''}">
            ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}
          </td>
          <td class="points">${team.points}</td>
        </tr>
      `;
      }
    )
    .join('');
};

const renderCharts = (standings) => {
  const sortedByGoals = [...standings].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 10);
  
  goalsBar.setOption({
    tooltip: { 
      trigger: 'axis',
      backgroundColor: chartColors.bg,
      borderColor: chartColors.primary,
      textStyle: { color: chartColors.text }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: sortedByGoals.map((t) => t.name),
      axisLabel: { color: chartColors.textMuted, rotate: 30, fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      type: 'bar',
      data: sortedByGoals.map((t) => ({
        value: t.goalsFor,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: chartColors.primary },
            { offset: 1, color: chartColors.secondary }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barWidth: '60%',
      animationDelay: (idx) => idx * 50
    }]
  }, true);

  const topFive = standings.slice(0, 5);
  const maxPoints = Math.max(...topFive.map((t) => t.points));
  const maxGF = Math.max(...topFive.map((t) => t.goalsFor));
  const maxGC = Math.max(...topFive.map((t) => t.goalsAgainst));
  
  radarChart.setOption({
    tooltip: {
      backgroundColor: chartColors.bg,
      borderColor: chartColors.primary,
      textStyle: { color: chartColors.text }
    },
    legend: { 
      data: topFive.map((t) => t.name), 
      textStyle: { color: chartColors.text },
      bottom: 0
    },
    radar: {
      indicator: [
        { name: 'Puntos', max: maxPoints + 5 },
        { name: 'Goles F', max: maxGF + 5 },
        { name: 'Goles C', max: maxGC + 5, inverse: true },
        { name: 'Posesión', max: 100 },
        { name: 'Tiros', max: 10 }
      ],
      axisName: { color: chartColors.textMuted },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [{
      type: 'radar',
      data: topFive.map((team, idx) => ({
        value: [
          team.points, 
          team.goalsFor, 
          maxGC - team.goalsAgainst + 10, 
          team.possessionAvg || 50, 
          team.shotsOnTargetAvg || 5
        ],
        name: team.name,
        itemStyle: { color: [chartColors.primary, chartColors.secondary, chartColors.success, chartColors.warning, chartColors.info][idx] },
        areaStyle: { opacity: 0.1 }
      })),
      animationDuration: 1000
    }]
  }, true);

  const colors = [chartColors.primary, chartColors.secondary, chartColors.success, chartColors.warning, chartColors.danger, chartColors.info, '#ec4899', '#84cc16', '#f97316', '#14b8a6'];
  const pieData = standings.slice(0, 10).map((team, idx) => ({
    name: team.name,
    value: team.points,
    itemStyle: { color: colors[idx % colors.length] }
  }));
  
  pointsPie.setOption({
    tooltip: { 
      trigger: 'item',
      backgroundColor: chartColors.bg,
      borderColor: chartColors.primary,
      textStyle: { color: chartColors.text },
      formatter: '{b}: {c} pts ({d}%)'
    },
    legend: { 
      orient: 'vertical', 
      right: 10, 
      top: 'center',
      textStyle: { color: chartColors.textMuted, fontSize: 10 },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 8
    },
    series: [{
      type: 'pie',
      radius: ['30%', '75%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: chartColors.bg, borderWidth: 2 },
      label: { 
        show: true,
        color: '#fff',
        fontSize: 10,
        formatter: '{b}\n{c} pts'
      },
      labelLine: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#fff' },
        itemStyle: { shadowBlur: 20, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
      },
      data: pieData
    }],
    animationType: 'scale',
    animationDuration: 1000
  }, true);

  pointsLine.setOption({
    tooltip: { 
      trigger: 'axis',
      backgroundColor: chartColors.bg,
      borderColor: chartColors.primary,
      textStyle: { color: chartColors.text }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      boundaryGap: false,
      data: standings.slice(0, 8).map((t) => t.name),
      axisLabel: { color: chartColors.textMuted, rotate: 20, fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      name: 'Puntos',
      type: 'line',
      smooth: true,
      data: standings.slice(0, 8).map((t) => t.points),
      lineStyle: { color: chartColors.success, width: 3 },
      itemStyle: { color: chartColors.success },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
          { offset: 1, color: 'rgba(16, 185, 129, 0)' }
        ])
      },
      symbol: 'circle',
      symbolSize: 8,
      animationDuration: 1500
    }]
  }, true);

  const sortedByDiff = [...standings].sort((a, b) => b.goalDifference - a.goalDifference).slice(0, 8);
  goalDiffChart.setOption({
    tooltip: { 
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: chartColors.bg,
      borderColor: chartColors.primary,
      textStyle: { color: chartColors.text }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'value',
      axisLabel: { color: chartColors.textMuted },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    yAxis: { 
      type: 'category', 
      data: sortedByDiff.map((t) => t.name),
      axisLabel: { color: chartColors.textMuted, fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [{
      type: 'bar',
      data: sortedByDiff.map((t) => ({
        value: t.goalDifference,
        itemStyle: {
          color: t.goalDifference > 0 
            ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: chartColors.success }, { offset: 1, color: chartColors.info }])
            : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: chartColors.danger }, { offset: 1, color: chartColors.warning }]),
          borderRadius: [0, 4, 4, 0]
        }
      })),
      barWidth: '50%',
      animationDelay: (idx) => idx * 100
    }]
  }, true);
};

const loadLeague = async (league) => {
  try {
    const response = await fetch(`/api/leagues/${encodeURIComponent(league)}`);
    const data = await response.json();

    renderOverview(data.overview);
    renderStandings(data.standings);
    renderCharts(data.standings);
  } catch (error) {
    console.error('Error loading league data:', error);
  }
};

leagueSelect.addEventListener('change', (event) => {
  loadLeague(event.target.value);
});

window.addEventListener('resize', () => {
  goalsBar.resize();
  radarChart.resize();
  pointsPie.resize();
  pointsLine.resize();
  goalDiffChart.resize();
});

loadLeague(leagueSelect.value);
