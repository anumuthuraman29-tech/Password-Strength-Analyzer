/**
 * SecurePass — Security Statistics & Chart.js Visualizer
 */
document.addEventListener('DOMContentLoaded', async () => {
  const donutCanvas = document.getElementById('strengthDonutChart');
  const barCanvas = document.getElementById('scoreBarChart');

  if (!donutCanvas && !barCanvas) return;

  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    renderCharts(data);
  } catch (err) {
    console.warn('Could not fetch /api/stats, loading default representation:', err);
    renderCharts({
      total: 5,
      strong: 2,
      medium: 2,
      weak: 1,
      percentages: { strong: 40, medium: 40, weak: 20 },
      scoreDistribution: [0, 1, 0, 1, 1, 2]
    });
  }

  function renderCharts(stats) {
    // Doughnut Chart: Strong, Medium, Weak
    if (donutCanvas && window.Chart) {
      new Chart(donutCanvas, {
        type: 'doughnut',
        data: {
          labels: [
            `Strong (${stats.percentages.strong}%)`,
            `Medium (${stats.percentages.medium}%)`,
            `Weak (${stats.percentages.weak}%)`
          ],
          datasets: [{
            data: [stats.strong, stats.medium, stats.weak],
            backgroundColor: [
              '#10b981', // green
              '#f59e0b', // amber
              '#ef4444'  // red
            ],
            borderColor: '#0f172a',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#94a3b8',
                font: { family: 'Plus Jakarta Sans', size: 12 },
                padding: 16
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#f8fafc',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              borderWidth: 1,
              padding: 12
            }
          },
          cutout: '72%'
        }
      });
    }

    // Bar Chart: Score Distribution (0/5, 1/5, 2/5, 3/5, 4/5, 5/5)
    if (barCanvas && window.Chart) {
      new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: ['Score 0', 'Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5'],
          datasets: [{
            label: 'Checks by Score',
            data: stats.scoreDistribution || [0, 1, 0, 1, 1, 2],
            backgroundColor: [
              'rgba(239, 68, 68, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(16, 185, 129, 0.7)'
            ],
            borderColor: [
              '#ef4444', '#ef4444', '#ef4444',
              '#f59e0b', '#f59e0b',
              '#10b981'
            ],
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#f8fafc',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { precision: 0, color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }
            }
          }
        }
      });
    }
  }
});
