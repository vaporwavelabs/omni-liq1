
import React from 'react';
import { ActivityLog } from '../types';

interface Props {
  logs: ActivityLog[];
}

const ActivityTable: React.FC<Props> = ({ logs }) => {
  return (
    <div className="card-themed overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-inherit opacity-90 flex justify-between items-center">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <i className="fa-solid fa-list-ul text-blue-500"></i> Live Activity
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold opacity-50 uppercase">Live Feed</span>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-inherit border-b border-inherit opacity-80 text-[10px] font-bold">
            <tr>
              <th className="px-6 py-4">Network</th>
              <th className="px-6 py-4">Operation</th>
              <th className="px-6 py-4">Asset Pair</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Net PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit/20">
            {logs.map((log) => (
              <tr key={log.id} className="hover:opacity-80 transition group">
                <td className="px-6 py-4 font-semibold opacity-90">
                  {log.network}
                </td>
                <td className="px-6 py-4 opacity-60 font-medium">
                  {log.type}
                </td>
                <td className="px-6 py-4 opacity-90 font-mono">
                  {log.pair}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    log.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10' : 
                    log.status === 'FAILED' ? 'text-rose-500 bg-rose-500/10' : 'text-amber-500 bg-amber-500/10'
                  }`}>
                    {log.status === 'SUCCESS' ? 'Success' : log.status === 'FAILED' ? 'Failed' : 'Pending'}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold font-mono ${log.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {log.pnl >= 0 ? '+' : ''}${log.pnl.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
