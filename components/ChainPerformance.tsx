
import React, { useState } from 'react';
import { ChainStat } from '../types';

interface Props {
  stats: ChainStat[];
}

const WinLossPie: React.FC<{ wins: number, losses: number, size?: 'sm' | 'md' }> = ({ wins, losses, size = 'md' }) => {
  const total = wins + losses;
  const isSm = size === 'sm';
  const width = isSm ? 'w-10 h-10' : 'w-12 h-12';
  
  if (total === 0) return <div className={`${width} rounded-full border border-slate-800 border-dashed shrink-0`}></div>;
  
  const winPercent = (wins / total) * 100;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (winPercent / 100) * circumference;

  return (
    <div className={`relative ${width} shrink-0`}>
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="transparent"
          stroke="#f43f5e"
          strokeWidth="6"
          className="opacity-20"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="transparent"
          stroke="#10b981"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center font-bold text-slate-300 ${isSm ? 'text-[7px]' : 'text-[8px]'}`}>
        {Math.round(winPercent)}%
      </div>
    </div>
  );
};

const ChainPerformance: React.FC<Props> = ({ stats }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <i className="fa-solid fa-layer-group text-blue-500"></i> Chain Diagnostics
        </h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[10px] font-bold uppercase bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition text-slate-300"
        >
          {isCollapsed ? 'Expand View' : 'Collapse to Squares'}
        </button>
      </div>
      
      <div className={`grid gap-4 transition-all duration-300 ${isCollapsed ? 'grid-cols-4 md:grid-cols-8 lg:grid-cols-10' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {stats.map((stat) => (
          <div 
            key={stat.network} 
            className={`bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition group overflow-hidden ${
              isCollapsed ? 'aspect-square flex flex-col items-center justify-center p-2 text-center' : 'p-4 flex items-center gap-4'
            }`}
          >
            <WinLossPie wins={stat.wins} losses={stat.losses} size={isCollapsed ? 'sm' : 'md'} />
            
            {!isCollapsed ? (
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    {stat.network}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${stat.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.totalProfit >= 0 ? '+' : ''}${stat.totalProfit.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span>W: <span className="text-emerald-500/80">{stat.wins}</span></span>
                  <span>L: <span className="text-rose-500/80">{stat.losses}</span></span>
                  <span>PnL</span>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex flex-col items-center">
                 <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate max-w-full">
                    {stat.network.substring(0, 4)}
                  </span>
                  <span className={`text-[8px] font-mono font-bold ${stat.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${Math.abs(stat.totalProfit).toFixed(0)}
                  </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChainPerformance;
