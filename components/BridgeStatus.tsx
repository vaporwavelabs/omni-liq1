
import React from 'react';
import { BridgeTask } from '../types';

interface Props {
  tasks: BridgeTask[];
}

const BridgeStatus: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <i className="fa-solid fa-bridge text-blue-400"></i> Bridge Activity
        </h2>
        <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded font-bold">LAYERZERO V2</span>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
        {tasks.map((task) => {
          const isComplete = task.progress >= 100 || task.estimatedTime === 'SUCCESS';
          
          return (
            <div 
              key={task.id} 
              className={`bg-slate-950 p-3 rounded-xl border transition-all duration-500 group ${
                isComplete 
                ? 'border-emerald-500/60 bg-emerald-500/5 animate-complete-pulse' 
                : 'border-slate-800 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  {task.from} 
                  {isComplete ? (
                    <i className="fa-solid fa-check-circle text-emerald-500 mx-1"></i>
                  ) : (
                    <i className="fa-solid fa-arrow-right mx-1 text-blue-500"></i>
                  )}
                  {task.to}
                </div>
                <span className={`font-mono text-xs font-bold transition-colors ${isComplete ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {task.amount.toFixed(2)} {task.asset}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={`transition-colors font-bold ${isComplete ? 'text-emerald-500 uppercase' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {isComplete ? 'SETTLED' : `ETA: ${task.estimatedTime}`}
                  </span>
                  <span className={`font-bold transition-colors ${isComplete ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {task.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isComplete 
                      ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' 
                      : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
                    }`} 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                 <div className="text-[9px] text-slate-600 font-mono truncate max-w-[120px]">
                   TX: <span className={`transition cursor-pointer ${isComplete ? 'text-emerald-500/70' : 'group-hover:text-blue-500'}`}>{task.txHash}</span>
                 </div>
                 <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">
                   Asset: <span className={isComplete ? 'text-emerald-300' : 'text-slate-300'}>{task.asset}</span>
                 </div>
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-xs italic">
            No active bridge tasks.
          </div>
        )}
      </div>
    </div>
  );
};

export default BridgeStatus;
