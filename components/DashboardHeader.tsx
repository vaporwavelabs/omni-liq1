
import React, { useState, useEffect, useRef } from 'react';
import { BotStatus, ActivityLog, Theme } from '../types';

interface Props {
  botState: BotStatus;
  recentLogs: ActivityLog[];
  efficiency: number;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const RainingLiquidation: React.FC = () => {
  const [items, setItems] = useState<{id: number, x: number}[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random();
      setItems(prev => [...prev, {
        id,
        x: Math.random() * 100
      }].slice(-30));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {items.map(item => (
        <div 
          key={item.id} 
          className="rain-item flex flex-col items-center"
          style={{ left: `${item.x}%`, animationDuration: `${0.7 + Math.random() * 0.9}s` }}
        >
          <i className="fa-solid fa-tint text-emerald-400 text-[8px] shadow-[0_0_10px_rgba(16,185,129,0.4)] opacity-70"></i>
        </div>
      ))}
    </div>
  );
};

const DashboardHeader: React.FC<Props> = ({ 
  botState, 
  recentLogs, 
  efficiency, 
  currentTheme, 
  onThemeChange 
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isBotCollapsed, setIsBotCollapsed] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [scanElapsedMs, setScanElapsedMs] = useState(0);
  const [scanningChain, setScanningChain] = useState('ETHEREUM');
  
  const chains = ['ARBITRUM', 'BASE', 'POLYGON', 'OPTIMISM', 'ETHEREUM', 'AVALANCHE', 'BNB_CHAIN', 'ZKSYNC', 'LINEA'];
  const isWin98 = currentTheme === 'win98';

  // Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Millisecond precision timer for scanning
  useEffect(() => {
    let animationFrameId: number;
    if (botState === 'scanning') {
      const start = performance.now();
      const update = () => {
        setScanElapsedMs(performance.now() - start);
        animationFrameId = requestAnimationFrame(update);
      };
      animationFrameId = requestAnimationFrame(update);
    } else {
      setScanElapsedMs(0);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [botState]);

  // Cycle through chains during scanning
  useEffect(() => {
    let chainInterval: number;
    if (botState === 'scanning') {
      chainInterval = window.setInterval(() => {
        setScanningChain(chains[Math.floor(Math.random() * chains.length)]);
      }, 450);
    }
    return () => clearInterval(chainInterval);
  }, [botState]);

  const toggleHud = () => {
    if (isBotCollapsed) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 400);
    }
    setIsBotCollapsed(!isBotCollapsed);
  };

  const renderSequentialSquares = () => {
    return (
      <div className="grid grid-cols-2 gap-1.5 w-12 h-12">
        <div className="w-5 h-5 bg-blue-500 square-1"></div>
        <div className="w-5 h-5 bg-blue-500 square-2"></div>
        <div className="w-5 h-5 bg-blue-500 square-4"></div>
        <div className="w-5 h-5 bg-blue-500 square-3"></div>
      </div>
    );
  };

  const renderBotIcon = (size: 'sm' | 'md' = 'sm') => {
    const colorClass = botState === 'scanning' ? 'text-blue-500' : botState === 'success' ? 'text-emerald-500' : 'text-rose-500';
    // Replaced satellite with robot as the universal 'bot status icon'
    const iconClass = 'fa-robot';
    
    // Attributed animations per state
    const animationClass = botState === 'scanning' 
      ? 'animate-pulse' 
      : botState === 'success' 
        ? 'animate-bot-bounce' 
        : 'animate-bot-sad';
        
    const sizeClass = size === 'md' ? 'text-3xl' : 'text-xl';
    
    return <i className={`fa-solid ${iconClass} ${colorClass} ${sizeClass} ${animationClass}`}></i>;
  };

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${isWin98 ? 'bg-[#c0c0c0] border-b-2 border-slate-400 shadow-none' : 'bg-[#020617]/95 backdrop-blur-md border-b border-slate-800 shadow-2xl'} mb-10 pb-4 pt-6 md:pt-10 -mx-4 md:-mx-8 px-4 md:px-8`}>
      <div className="flex items-center justify-between gap-4">
        {/* Brand Section */}
        <div className="flex items-center gap-4">
          {/* Bot status icon and animation shown when brand area is visible and HUD is collapsed */}
          {isBotCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 pr-3 border-r border-slate-800/40">
              {renderBotIcon('sm')}
            </div>
          )}
          <div className="flex flex-col select-none">
            <h1 className={`text-3xl font-black tracking-tighter ${isWin98 ? 'text-[#000080]' : 'text-white'} leading-none`}>
              Hash Flow <span className={`${isWin98 ? 'text-black' : 'text-blue-500'} font-light italic`}>Metrics</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold ${isWin98 ? 'text-black font-mono' : 'text-slate-500'} uppercase tracking-[0.3em]`}>
                LIVE_FEED_v4 // {time}
              </span>
            </div>
          </div>
        </div>

        {/* Theme Toggles */}
        <div className={`flex items-center gap-1 p-1.5 rounded-xl ${isWin98 ? 'bg-gray-400 border inset border-white' : 'bg-slate-900 border border-slate-800'}`}>
          <button onClick={() => onThemeChange('dark')} className={`p-2 rounded-lg transition-all ${currentTheme === 'dark' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><i className="fa-solid fa-moon text-xs"></i></button>
          <button onClick={() => onThemeChange('light')} className={`p-2 rounded-lg transition-all ${currentTheme === 'light' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}><i className="fa-solid fa-sun text-xs"></i></button>
          <button onClick={() => onThemeChange('win98')} className={`p-2 rounded-lg transition-all ${currentTheme === 'win98' ? 'bg-[#000080] text-white' : 'text-slate-500 hover:text-slate-300'}`}><i className="fa-solid fa-desktop text-xs"></i></button>
        </div>
      </div>

      {/* Center +/- Toggle Button */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-20">
        <button 
          onClick={toggleHud}
          className={`flex items-center justify-center w-10 h-10 border transition-all active:scale-95 shadow-2xl rounded-full ${
            isWin98 
              ? 'bg-[#c0c0c0] border-t-white border-l-white border-b-gray-700 border-r-gray-700 text-black active:border-inset' 
              : !isBotCollapsed ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/50' : 'bg-slate-900 border-slate-800 text-blue-500 hover:bg-slate-800'
          }`}
          title={isBotCollapsed ? "Expand" : "Collapse"}
        >
          <i className={`fa-solid ${isBotCollapsed ? 'fa-plus' : 'fa-minus'} text-sm`}></i>
        </button>
      </div>

      {/* Expanded Telemetry HUD */}
      {!isBotCollapsed && (
        <div className={`mt-8 mb-4 relative grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden rounded-2xl`}>
          {showFlash && <div className="absolute inset-0 z-50 animate-hud-flash pointer-events-none"></div>}
          
          {/* Status Animation Section */}
          <div className={`${isWin98 ? 'bg-[#c0c0c0] border-2 border-inset border-white' : 'bg-slate-950/90 border border-slate-800/60 rounded-2xl'} md:col-span-5 p-6 flex flex-col items-center justify-center gap-3 relative min-h-[200px]`}>
            {botState === 'success' && <RainingLiquidation />}
            
            <div className="z-20 w-full flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-1.5 w-full">
                <span className={`text-[10px] font-black ${isWin98 ? 'text-black' : 'text-slate-500'} uppercase tracking-[0.4em]`}>
                  {botState === 'scanning' ? 'SEARCHING_MAPPED_NODES' : botState === 'success' ? 'SETTLEMENT_LOCKED' : 'TX_ABORTED'}
                </span>
                
                {botState === 'scanning' && (
                  <div className="flex flex-col items-center gap-5 w-full">
                    <div className="flex items-center justify-center gap-10">
                       {renderSequentialSquares()}
                       <div className="flex flex-col items-start min-w-[140px]">
                         <span className="retro-cpu-font text-white text-4xl font-black">
                           T+{(scanElapsedMs / 1000).toFixed(3)}s
                         </span>
                         <div className="mt-1 flex flex-col">
                           <span className={`text-[11px] font-mono ${isWin98 ? 'text-[#000080]' : 'text-blue-400'} font-bold uppercase tracking-wider`}>
                             Target: <span className="text-white animate-pulse">{scanningChain}</span>
                           </span>
                           <span className="text-[8px] font-mono text-slate-500 uppercase">Synchronizing mempool...</span>
                         </div>
                       </div>
                    </div>
                  </div>
                )}
                
                {botState === 'success' && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                       {/* Bot status icon also used here in expanded view */}
                       {renderBotIcon('md')}
                       <div className="flex items-center gap-3">
                         <i className="fa-solid fa-cloud text-emerald-400 text-2xl animate-cloud-shake shadow-[0_0_15px_rgba(16,185,129,0.3)]"></i>
                         <span className="text-emerald-500 font-black text-2xl animate-pulse tracking-tight">LIQUIDATED</span>
                       </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/40 uppercase tracking-widest">Chain sync finalized</span>
                  </div>
                )}
                
                {botState === 'failure' && (
                  <div className="flex items-center gap-3 bg-rose-500/10 px-5 py-2 rounded-lg border border-rose-500/20">
                    {renderBotIcon('md')}
                    <span className="text-rose-500 font-black text-xs uppercase tracking-widest">Gas Limit Exceeded</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Logs Section */}
          <div className={`${isWin98 ? 'bg-[#c0c0c0] border-2 border-inset border-white' : 'bg-slate-950/90 border border-slate-800/60 rounded-2xl'} md:col-span-4 p-4`}>
             <div className="flex justify-between items-center mb-4">
                <h4 className={`text-[9px] font-black ${isWin98 ? 'text-[#000080]' : 'text-blue-500'} uppercase tracking-[0.3em]`}>Mempool Stream</h4>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[8px] font-mono text-slate-500 uppercase">Secure Link</span>
                </div>
             </div>
             <div className="space-y-2">
                {recentLogs.slice(0, 3).map((log, idx) => (
                  <div key={idx} className={`flex items-center justify-between text-[11px] font-mono border-b ${isWin98 ? 'border-gray-400' : 'border-slate-800/30'} pb-2 last:border-0 group cursor-default`}>
                    <div className="flex items-center gap-3">
                      <span className={`${isWin98 ? 'text-black font-bold' : 'text-blue-400 font-black'} w-8 text-[9px]`}>{log.network.substring(0,3)}</span>
                      <span className={`${isWin98 ? 'text-black' : 'text-slate-400'} truncate max-w-[140px] group-hover:text-white transition-colors`}>{log.pair}</span>
                    </div>
                    <span className={`font-bold ${log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ${Math.abs(log.pnl).toFixed(2)}
                    </span>
                  </div>
                ))}
             </div>
          </div>

          {/* Efficiency Metric Section */}
          <div className={`${isWin98 ? 'bg-[#c0c0c0] border-2 border-inset border-white' : 'bg-slate-950/90 border border-slate-800/60 rounded-2xl'} md:col-span-3 p-4 flex flex-col justify-center`}>
             <div className="flex items-end justify-between mb-2">
                <h4 className={`text-[9px] font-bold ${isWin98 ? 'text-black' : 'text-slate-500'} uppercase tracking-widest`}>Flow Synergy</h4>
                <span className={`text-2xl font-black ${isWin98 ? 'text-[#000080]' : 'text-blue-400'} font-mono leading-none`}>{efficiency}%</span>
             </div>
             <div className={`w-full ${isWin98 ? 'bg-white border inset' : 'bg-slate-900'} h-3 rounded-sm overflow-hidden p-0.5`}>
                <div className={`h-full ${isWin98 ? 'bg-[#000080]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'} transition-all duration-1000`} style={{ width: `${efficiency}%` }}></div>
             </div>
             <div className="mt-4 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <span className={`${isWin98 ? 'text-black' : 'text-slate-600'} uppercase`}>Cores: 16/16</span>
                  <span className="text-emerald-500/80">NOMINAL</span>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
