
export type BotStatus = 'scanning' | 'success' | 'failure';
export type Theme = 'dark' | 'light' | 'win98';

export interface NetworkStatus {
  name: string;
  latency: number | 'SYNC';
  status: 'online' | 'syncing' | 'offline';
}

export interface ActivityLog {
  id: string;
  network: string;
  type: string;
  pair: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  pnl: number;
  timestamp: Date;
}

export interface BridgeTask {
  id: string;
  from: string;
  to: string;
  amount: number;
  asset: string;
  progress: number;
  estimatedTime: string;
  txHash: string;
}

export interface MarketMetrics {
  aggregatedProfit: number;
  profitChange: number;
  gasWalletEth: number;
  gasValueUsd: number;
  gasLastTopUp: string;
  gasFundingSource: string;
  efficiency: number;
  bridgedToday: number;
}

export interface AiInsightResponse {
  summary: string;
  riskLevel: string;
  optimization: string;
  threatAssessment: string;
  spokeStrategy: string;
}

export interface ChainStat {
  network: string;
  wins: number;
  losses: number;
  totalProfit: number;
}
