export const PLATFORM_LABELS = {
  'App Store': 'App Store',
  'Reddit': 'Reddit',
  'Instagram': 'Instagram',
  'Google Serp': 'Google Serp',
  'Quora': 'Quora',
  'Google Play': 'Google Play',
  'Trustpilot': 'Trustpilot',
} as const;

export const SENTIMENT_COLORS = {
  positive: '#4caf50',
  negative: '#f44336',
  neutral: '#9e9e9e',
} as const;

export const PRIORITY_COLORS = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'default',
} as const;

export const INTENT_LABELS = {
  complaint: 'Complaint',
  question: 'Question',
  recommendation: 'Recommendation',
  neutral: 'Neutral',
} as const;

export const RESPONSE_STYLES = {
  official: {
    label: 'Official',
    description: 'Formal, professional tone suitable for corporate communications',
  },
  friendly: {
    label: 'Friendly',
    description: 'Warm, approachable tone that builds personal connections',
  },
  technical: {
    label: 'Technical',
    description: 'Detailed, solution-focused tone for support scenarios',
  },
} as const;

export const LANGUAGES = {
  en: 'English',
  uk: 'Українська',
} as const;

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export const DATA_REFRESH_INTERVAL = Number(import.meta.env.VITE_DATA_REFRESH_INTERVAL) || 30000; // 30 seconds
export const ALERT_REFRESH_INTERVAL = Number(import.meta.env.VITE_ALERT_REFRESH_INTERVAL) || 10000; // 10 seconds

export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
