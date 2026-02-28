
import React from 'react';
import { NetworkStatus } from '../types';

interface Props {
  networks: NetworkStatus[];
}

const NetworkFooter: React.FC<Props> = ({ networks }) => {
  return (
    <div className="mt-12 py-6 border-t border-slate-900">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] w-full text-center mb-2">Omnichain Node Status</h3>
        {networks.map((net) => (
          <div key={net.name} className="bg-slate-900/50 border border-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-3 min-w-[140px] hover:border-slate-700 transition-colors">
            <div className={`h-2 w-2 rounded-full ${
              net.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
              net.status === 'syncing' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></div>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider truncate">{net.name}</p>
              <p className="text-xs font-mono font-bold text-slate-300 leading-none mt-1">
                {net.latency === 'SYNC' ? 'SYNCING...' : `${net.latency}ms`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkFooter;
