import axios from 'axios';
import apiClient from './api';
import {
  ReputationScore,
  SentimentTrend,
  PlatformStats,
  TopIssue,
  TopicAnalysis,
  ResponseMetrics,
  AnalyticsDateRange,
  DashboardData,
  AnalyticsApiResponse,
} from '@/types/analytics';

const API_BASE_URL = 'https://maryland-managerial-pamala.ngrok-free.dev';

export const getDashboardData = async (
  productId: number = 1,
  daysBack: number = 30
): Promise<DashboardData> => {
  try {
    const params = new URLSearchParams();
    params.append('product_id', productId.toString());
    params.append('days_back', daysBack.toString());

    const url = `${API_BASE_URL}/dashboard?${params.toString()}`;

    console.log('Fetching dashboard data from:', url);

    const response = await axios.get<DashboardData>(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    console.log('Dashboard API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const getAnalyticsData = async (
  productId: number = 1,
  daysBack: number = 30
): Promise<AnalyticsApiResponse> => {
  try {
    const params = new URLSearchParams();
    if (productId) params.append('product_id', productId.toString());
    if (daysBack) params.append('days_back', daysBack.toString());

    const url = `${API_BASE_URL}/analytics${params.toString() ? `?${params.toString()}` : ''}`;

    console.log('Fetching analytics data from:', url);

    const response = await axios.get<AnalyticsApiResponse>(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    console.log('Analytics API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

export const getReputationScore = async (): Promise<ReputationScore> => {
  // Mock data for now
  return {
    score: 73,
    change: 5.2,
    trend: 'up',
    last_updated: new Date().toISOString(),
  };

  // Real implementation:
  // return apiClient.get('/api/analytics/reputation-score');
};

export const getSentimentTrend = async (
  dateRange: AnalyticsDateRange
): Promise<SentimentTrend[]> => {
  // Mock data
  const days = 30;
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return {
      date: date.toISOString().split('T')[0],
      positive: Math.floor(Math.random() * 50) + 20,
      negative: Math.floor(Math.random() * 30) + 10,
      neutral: Math.floor(Math.random() * 40) + 15,
      total: 0,
    };
  }).map((item) => ({
    ...item,
    total: item.positive + item.negative + item.neutral,
  }));

  // return apiClient.post('/api/analytics/sentiment-trend', dateRange);
};

export const getPlatformStats = async (dateRange: AnalyticsDateRange): Promise<PlatformStats[]> => {
  // Mock data
  const platforms = [
    'google_serp',
    'app_store',
    'google_play',
    'trustpilot',
    'facebook',
    'instagram',
    'reddit',
    'quora',
  ];
  return platforms.map((platform) => ({
    platform: platform as any,
    total_mentions: Math.floor(Math.random() * 500) + 100,
    sentiment_distribution: {
      positive: Math.floor(Math.random() * 200) + 50,
      negative: Math.floor(Math.random() * 100) + 20,
      neutral: Math.floor(Math.random() * 150) + 30,
    },
    avg_sentiment_score: Math.random() * 2 - 1,
  }));

  // return apiClient.post('/api/analytics/platform-stats', dateRange);
};

export const getTopIssues = async (dateRange: AnalyticsDateRange): Promise<TopIssue[]> => {
  // Mock data
  const issues = [
    {
      title: 'App Crashing on iOS',
      description: 'Users reporting crashes after latest update',
      priority: 'critical' as const,
    },
    {
      title: 'Payment Processing Issues',
      description: 'Multiple payment failures reported',
      priority: 'high' as const,
    },
    {
      title: 'Slow Loading Times',
      description: 'Performance degradation in dashboard',
      priority: 'high' as const,
    },
    {
      title: 'Missing Feature Requests',
      description: 'Users asking for export functionality',
      priority: 'medium' as const,
    },
    {
      title: 'UI Confusion',
      description: 'Navigation unclear for new users',
      priority: 'medium' as const,
    },
  ];

  return issues.map((issue, i) => ({
    id: `issue-${i}`,
    ...issue,
    sentiment: 'negative' as const,
    frequency: Math.floor(Math.random() * 50) + 10,
    trend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as any,
    platforms: ['app_store', 'reddit'] as any,
    first_seen: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    last_seen: new Date().toISOString(),
    related_mentions: Math.floor(Math.random() * 100) + 20,
  }));

  // return apiClient.post('/api/analytics/top-issues', dateRange);
};

export const getTopicAnalysis = async (dateRange: AnalyticsDateRange): Promise<TopicAnalysis[]> => {
  // Mock data
  const topics = ['Performance', 'Features', 'Support', 'Pricing', 'UI/UX', 'Bugs', 'Security'];
  return topics.map((topic) => ({
    topic,
    count: Math.floor(Math.random() * 200) + 50,
    sentiment_score: Math.random() * 2 - 1,
    trend: (Math.random() - 0.5) * 20,
    keywords: ['keyword1', 'keyword2', 'keyword3'],
  }));

  // return apiClient.post('/api/analytics/topic-analysis', dateRange);
};

export const getResponseMetrics = async (
  dateRange: AnalyticsDateRange
): Promise<ResponseMetrics> => {
  // Mock data
  return {
    total_responses: 342,
    avg_response_time: 127, // minutes
    response_rate: 78.5,
    by_platform: {
      google_serp: 45,
      app_store: 89,
      google_play: 76,
      trustpilot: 34,
      facebook: 28,
      instagram: 21,
      reddit: 32,
      quora: 17,
      forum: 0,
    },
  };

  // return apiClient.post('/api/analytics/response-metrics', dateRange);
};
