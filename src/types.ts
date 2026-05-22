export interface QueueItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  categoryPrefix: string;
  status: 'waiting' | 'calling' | 'served' | 'skipped' | 'cancelled';
  createdAt: string;
  calledAt?: string;
  finishedAt?: string;
  counterNumber?: number;
}

export interface BusinessInfo {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  totalCounters: number;
  averageServiceTime: number; // in minutes
  isPaused: boolean;
  qrCodeUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: 'admin' | 'user';
  business: BusinessInfo | null;
}

export interface AnalyticsData {
  dailyReport: { date: string; count: number }[];
  busyHours: { hour: string; count: number }[];
  averageServiceTime: number; // minutes
  totalCustomersToday: number;
  skippedPercent: number;
  servedPercent: number;
}
