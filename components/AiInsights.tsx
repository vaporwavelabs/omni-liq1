
import React from 'react';
import { AiInsightResponse } from '../types';

interface Props {
  insight: AiInsightResponse | null;
  loading: boolean;
}

const AiInsights: React.FC<Props> = ({ insight, loading }) => {
  const isCritical = insight?.riskLevel.toLowerCase().includes('critical') || insight?.riskLevel.toLowerCase().includes('high');

  return (
    <div className={`bg-slate-900 border rounded-2xl overflow-hidden h-full flex flex-col transition-all ${isCritical ? 'border-rose-500/50' : 'border-slate-800'}`}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <i className="fa-solid fa-brain text-purple-400"></i> AI Insights
        </h2>
        {insight?.riskLevel && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            isCritical ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-400'
          }`}>
            Risk: {insight.riskLevel}
          </span>
        )}
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-20 bg-slate-800/50 rounded"></div>
            <div className="h-10 bg-slate-800/50 rounded"></div>
          </div>
        ) : insight ? (
          <>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Market Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                {insight.summary}
              </p>
            </div>

            <div className="bg-blue-500/5 border-l-4 border-blue-500/50 p-4 rounded-r-xl">
              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Current Strategy</h4>
              <p className="text-xs text-slate-300">
                {insight.spokeStrategy}
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              insight.threatAssessment.toUpperCase().includes('NOMINAL') 
              ? 'bg-emerald-500/5 border-emerald-500/10' 
              : 'bg-rose-500/5 border-rose-500/10'
            }`}>
              <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                 insight.threatAssessment.toUpperCase().includes('NOMINAL') ? 'text-emerald-500' : 'text-rose-400'
              }`}>Threat Assessment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {insight.threatAssessment}
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
              <h4 className="text-[10px] font-bold text-slate-600 uppercase mb-1">System Optimization</h4>
              <p className="text-[11px] text-slate-500 truncate">
                {insight.optimization}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-600 text-xs italic">
            Connecting to core AI sub-systems...
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsights;
