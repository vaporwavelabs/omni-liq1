
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';
import ActivityTable from './components/ActivityTable';
import BridgeStatus from './components/BridgeStatus';
import AiInsights from './components/AiInsights';
import ChainPerformance from './components/ChainPerformance';
import NetworkFooter from './components/NetworkFooter';
import { ActivityLog, BridgeTask, MarketMetrics, AiInsightResponse, ChainStat, BotStatus, NetworkStatus, Theme } from './types';
import { getMarketInsights } from './services/geminiService';

const INITIAL_LOGS: ActivityLog[] = [
  { id: '1', network: 'ARBITRUM', type: 'LIQUIDATION', pair: 'WETH/USDT', status: 'SUCCESS', pnl: 122.40, timestamp: new Date() },
  { id: '2', network: 'BASE', type: 'LIQUIDATION', pair: 'cbETH/USDC', status: 'SUCCESS', pnl: 84.15, timestamp: new Date() },
  { id: '3', network: 'POLYGON', type: 'REBALANCE', pair: 'MATIC/USDC', status: 'SUCCESS', pnl: 12.00, timestamp: new Date() },
  { id: '4', network: 'ARBITRUM', type: 'LIQUIDATION', pair: 'LINK/USDC', status: 'FAILED', pnl: -1.20, timestamp: new Date() },
  { id: '5', network: 'OPTIMISM', type: 'LIQUIDATION', pair: 'OP/USDC', status: 'SUCCESS', pnl: 45.20, timestamp: new Date() },
];

const App: React.FC = () => {
  const [botState, setBotState] = useState<BotStatus>('scanning');
  const [theme, setTheme] = useState<Theme>('dark');
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [networks, setNetworks] = useState<NetworkStatus[]>([
    { name: 'Arbitrum', latency: 12, status: 'online' },
    { name: 'Base', latency: 18, status: 'online' },
    { name: 'Polygon', latency: 'SYNC', status: 'syncing' },
    { name: 'Optimism', latency: 24, status: 'online' },
    { name: 'Ethereum', latency: 85, status: 'online' },
  ]);

  const [bridgeTasks, setBridgeTasks] = useState<BridgeTask[]>([
    { 
      id: 'b1', 
      from: 'BASE', 
      to: 'ARB', 
      amount: 450.00, 
      asset: 'USDC', 
      progress: 75, 
      estimatedTime: '2m 30s', 
      txHash: '0x4f...9e2b' 
    },
    { 
      id: 'b2', 
      from: 'ARB', 
      to: 'MAINNET', 
      amount: 1.25, 
      asset: 'WETH', 
      progress: 12, 
      estimatedTime: '14m 45s', 
      txHash: '0x1a...f3c9' 
    }
  ]);
  const [metrics, setMetrics] = useState<MarketMetrics>({
    aggregatedProfit: 3842.12,
    profitChange: 4.2,
    gasWalletEth: 0.142,
    gasValueUsd: 320.50,
    gasLastTopUp: '2H 14M AGO',
    gasFundingSource: 'BRIDGE_04',
    efficiency: 98.2,
    bridgedToday: 1250.00
  });
  
  const [aiInsight, setAiInsight] = useState<AiInsightResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playSuccessBeep = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.1, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    const now = ctx.currentTime;
    playNote(880, now, 0.1);
    playNote(1320, now + 0.08, 0.15);
  }, []);

  const chainStats = useMemo(() => {
    const statsMap: Record<string, ChainStat> = {
      'ARBITRUM': { network: 'ARBITRUM', wins: 0, losses: 0, totalProfit: 0 },
      'BASE': { network: 'BASE', wins: 0, losses: 0, totalProfit: 0 },
      'POLYGON': { network: 'POLYGON', wins: 0, losses: 0, totalProfit: 0 },
      'OPTIMISM': { network: 'OPTIMISM', wins: 0, losses: 0, totalProfit: 0 },
      'ETHEREUM': { network: 'ETHEREUM', wins: 0, losses: 0, totalProfit: 0 },
    };

    logs.forEach(log => {
      const net = log.network.toUpperCase();
      if (!statsMap[net]) {
        statsMap[net] = { network: net, wins: 0, losses: 0, totalProfit: 0 };
      }
      if (log.status === 'SUCCESS') statsMap[net].wins++;
      else if (log.status === 'FAILED') statsMap[net].losses++;
      statsMap[net].totalProfit += log.pnl;
    });

    return Object.values(statsMap);
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate Metric jitter
      const pnlBump = (Math.random() - 0.2) * 5;
      setMetrics(prev => ({
        ...prev,
        aggregatedProfit: prev.aggregatedProfit + pnlBump,
        gasWalletEth: Math.max(0.01, prev.gasWalletEth - 0.00005)
      }));

      // Simulate Latency jitter
      setNetworks(prev => prev.map(n => ({
        ...n,
        latency: n.latency === 'SYNC' ? 'SYNC' : Math.max(10, n.latency + (Math.floor(Math.random() * 7) - 3))
      })));

      // Event Generation
      if (Math.random() > 0.8) {
        const availableNetworks = ['ARBITRUM', 'BASE', 'POLYGON', 'OPTIMISM', 'ETHEREUM'];
        const isSuccess = Math.random() > 0.15;
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          network: availableNetworks[Math.floor(Math.random() * availableNetworks.length)],
          type: 'LIQUIDATION',
          pair: 'WETH/USDC',
          status: isSuccess ? 'SUCCESS' : 'FAILED',
          pnl: isSuccess ? (Math.random() * 80) : -(Math.random() * 5),
          timestamp: new Date()
        };

        setBotState(isSuccess ? 'success' : 'failure');
        if (isSuccess) {
          playSuccessBeep();
        }
        
        setTimeout(() => setBotState('scanning'), 3000);
        setLogs(prev => [newLog, ...prev.slice(0, 14)]);
      }

      setBridgeTasks(prev => prev.map(t => {
        const newProgress = t.progress >= 100 ? 0 : t.progress + Math.floor(Math.random() * 5);
        return {
          ...t,
          progress: newProgress,
          estimatedTime: newProgress >= 100 ? 'SUCCESS' : `${Math.floor((100 - newProgress) / 5)}m`
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [playSuccessBeep]);

  const refreshAi = useCallback(async () => {
    initAudio();
    if (loadingAi) return;
    setLoadingAi(true);
    const insight = await getMarketInsights(logs);
    setAiInsight(insight);
    setLoadingAi(false);
  }, [logs, initAudio, loadingAi]);

  useEffect(() => {
    refreshAi();
  }, []);

  return (
    <div 
      className={`theme-${theme} px-4 pb-4 md:px-8 md:pb-8 max-w-[1600px] mx-auto space-y-8 min-h-screen transition-all duration-300`}
      onClick={initAudio}
    >
      <DashboardHeader 
        botState={botState} 
        recentLogs={logs} 
        efficiency={metrics.efficiency} 
        currentTheme={theme}
        onThemeChange={setTheme}
      />
      
      <div className="space-y-8">
        <StatsCards metrics={metrics} />

        <ChainPerformance stats={chainStats} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-fit lg:h-[500px]">
          <div className="lg:col-span-3">
            <ActivityTable logs={logs} />
          </div>

          <div className="lg:col-span-1 space-y-6 flex flex-col">
            <div className="flex-1 min-h-[300px]">
              <BridgeStatus tasks={bridgeTasks} />
            </div>
            <div className="flex-1 min-h-[350px]">
              <AiInsights insight={aiInsight} loading={loadingAi} />
            </div>
            
            <button 
              onClick={refreshAi}
              disabled={loadingAi}
              className={`w-full text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shrink-0 ${
                theme === 'win98' 
                ? 'bg-[#c0c0c0] border-t-white border-l-white border-b-gray-700 border-r-gray-700 text-black active:border-inset' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              <i className={`fa-solid fa-rotate ${loadingAi ? 'animate-spin' : ''}`}></i>
              {loadingAi ? 'AI Synchronizing...' : 'Refresh Strategy'}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <NetworkFooter networks={networks} />
      </div>

      <footer className={`mt-8 text-center font-medium text-[10px] uppercase tracking-widest pt-8 pb-4 border-t ${
        theme === 'win98' ? 'text-black border-gray-400' : 'text-slate-600 border-slate-900'
      }`}>
        HASH_FLOW metrics &copy; 2024 // Real-time Cross-chain Intelligence
      </footer>
    </div>
  );
};

export default App;
