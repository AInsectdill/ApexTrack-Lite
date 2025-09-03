export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  account_status: string;
  expired_at?: string;
}

export interface Offer {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'paused' | 'pending';
  country: string;
  device: string;
  can_show_to_proxy: boolean;
}

export interface DashboardData {
  summary: {
    today_clicks: number;
    today_leads: number;
    today_revenue: number;
    today_epc: number;
  };
  recent_clicks: any[];
  performance_report: any[];
  recent_leads: any[];
}

export interface AuthResponse {
  token: string;
  user: User;
}