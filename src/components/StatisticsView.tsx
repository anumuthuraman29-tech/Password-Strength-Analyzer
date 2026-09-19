import React, { useEffect, useRef } from 'react';
import { 
  PieChart, BarChart3, ShieldCheck, ShieldAlert, 
  Shield, Fingerprint, Info 
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { SecurityStats } from '../types';

Chart.register(...registerables);

interface StatisticsViewProps {
  stats: SecurityStats;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ stats }) => {
  const donutRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const donutChartInstance = useRef<Chart | null>(null);
  const barChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Doughnut Chart Setup
    if (donutRef.current) {
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
      }

      donutChartInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Strong (Enterprise)', 'Medium (Moderate)', 'Weak (Vulnerable)'],
          datasets: [
            {
              data: [stats.strong, stats.medium, stats.weak],
              backgroundColor: [
                'rgba(16, 185, 129, 0.85)',
                'rgba(245, 158, 11, 0.85)',
                'rgba(239, 68, 68, 0.85)'
              ],
              borderColor: [
                '#10b981',
                '#f59e0b',
                '#ef4444'
              ],
              borderWidth: 2,
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#94a3b8',
                font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
                padding: 16
              }
            },
            tooltip: {
              backgroundColor: 'rgba(14, 22, 41, 0.95)',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              borderWidth: 1,
              titleColor: '#f8fafc',
              bodyColor: '#38bdf8',
              padding: 10
            }
          },
          cutout: '72%'
        }
      });
    }

    // Bar Chart Setup
    if (barRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      barChartInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['Score 0', 'Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5'],
          datasets: [
            {
              label: 'Frequency of Evaluated Credentials',
              data: stats.scoreDistribution,
              backgroundColor: [
                'rgba(239, 68, 68, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(16, 185, 129, 0.7)'
              ],
              borderColor: [
                '#ef4444',
                '#ef4444',
                '#ef4444',
                '#f59e0b',
                '#f59e0b',
                '#10b981'
              ],
              borderWidth: 1.5,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8', font: { size: 11 } }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8', stepSize: 1, font: { size: 11 } },
              beginAtZero: true
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(14, 22, 41, 0.95)',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              borderWidth: 1,
              titleColor: '#f8fafc',
              bodyColor: '#38bdf8',
              padding: 10
            }
          }
        }
      });
    }

    return () => {
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Checked */}
        <div className="p-5 rounded-2xl bg-[#0e1629]/70 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Audited</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono mb-1">{stats.total}</div>
          <div className="text-xs text-slate-500 font-mono">Aggregated Evaluations</div>
        </div>

        {/* Strong */}
        <div className="p-5 rounded-2xl bg-[#0e1629]/70 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strong</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono mb-1">{stats.strong}</div>
          <div className="text-xs text-emerald-400 font-semibold">{stats.percentages.strong}% of checked</div>
        </div>

        {/* Medium */}
        <div className="p-5 rounded-2xl bg-[#0e1629]/70 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medium</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono mb-1">{stats.medium}</div>
          <div className="text-xs text-amber-400 font-semibold">{stats.percentages.medium}% of checked</div>
        </div>

        {/* Weak */}
        <div className="p-5 rounded-2xl bg-[#0e1629]/70 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weak</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono mb-1">{stats.weak}</div>
          <div className="text-xs text-rose-400 font-semibold">{stats.percentages.weak}% of checked</div>
        </div>
      </div>

      {/* Two Responsive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <div className="p-6 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Password Strength Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Ratio of strong, medium, and weak credentials evaluated.</p>
          </div>

          <div className="h-64 w-full relative flex-1">
            <canvas ref={donutRef} />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Strong</div>
              <div className="text-base font-black text-emerald-400">{stats.percentages.strong}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Medium</div>
              <div className="text-base font-black text-amber-400">{stats.percentages.medium}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Weak</div>
              <div className="text-base font-black text-rose-400">{stats.percentages.weak}%</div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-6 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Entropy Score Histogram (0–5)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Count of passwords satisfying 0 through 5 policy criteria.</p>
          </div>

          <div className="h-64 w-full relative flex-1">
            <canvas ref={barRef} />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Scores 0–2 represent critical vulnerability; 3–4 indicate moderate risk; 5 is enterprise-grade.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
