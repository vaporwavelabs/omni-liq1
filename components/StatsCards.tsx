
import React from 'react';
import { MarketMetrics } from '../types';

interface Props {
  metrics: MarketMetrics;
}

const StatsCards: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="card-themed p-5 relative overflow-hidden group hover:opacity-90 transition">
        <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">Net Profit</h3>
        <p className="text-2xl font-bold text-emerald-500">
          ${metrics.aggregatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
           <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">+{metrics.profitChange}%</span>
           <span className="text-[9px] opacity-50 uppercase font-medium">vs 24h</span>
        </div>
      </div>

      <div className="card-themed p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">Gas Reserves</h3>
        <p className="text-xl font-bold">
          {metrics.gasWalletEth.toFixed(3)} <span className="text-sm font-normal opacity-50">ETH</span>
        </p>
        <p className="text-[10px] opacity-50 mt-1 font-mono">${metrics.gasValueUsd} USD</p>
      </div>

      <div className="card-themed p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">Last Funding</h3>
        <p className="text-sm font-bold uppercase truncate">{metrics.gasFundingSource}</p>
        <p className="text-[10px] opacity-50 mt-1 uppercase font-mono">{metrics.gasLastTopUp}</p>
      </div>

      <div className="card-themed p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">Core Efficiency</h3>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xl font-bold text-blue-400">{metrics.efficiency}%</p>
          <span className="text-[9px] opacity-50">OPTIMAL</span>
        </div>
        <div className="w-full bg-slate-800/20 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${metrics.efficiency}%` }}></div>
        </div>
      </div>

      <div className="card-themed p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">Total Bridged</h3>
        <p className="text-xl font-bold">
          ${metrics.bridgedToday.toLocaleString()}
        </p>
        <p className="text-[10px] opacity-50 mt-1 uppercase font-mono">24h volume</p>
      </div>
    </div>
  );
};

export default StatsCards;
