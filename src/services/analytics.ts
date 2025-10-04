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
    current_score: 73,
    previous_score: 68,
    percentage_change: 5.2,
    change_direction: 'increase',
    change_description: 'Score improved by 5.2% compared to previous period',
    score_interpretation: {
      status: 'Good',
      description: 'Your reputation score is in a healthy range',
      action: 'Continue monitoring and responding to mentions',
    },
    current_period: {
      start: '2024-01-01',
      end: '2024-01-31',
      mentions_count: 150,
    },
    previous_period: {
      start: '2023-12-01',
      end: '2023-12-31',
      mentions_count: 120,
    },
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
    const positive = Math.floor(Math.random() * 50) + 20;
    const negative = Math.floor(Math.random() * 30) + 10;
    const neutral = Math.floor(Math.random() * 40) + 15;
    const total = positive + negative + neutral;

    return {
      date: date.toISOString().split('T')[0],
      positive,
      negative,
      neutral,
      total,
      sentiment_ratio: {
        positive: total > 0 ? positive / total : 0,
        negative: total > 0 ? negative / total : 0,
        neutral: total > 0 ? neutral / total : 0,
      },
    };
  });

  // return apiClient.post('/api/analytics/sentiment-trend', dateRange);
};

export const getPlatformStats = async (
  dateRange: AnalyticsDateRange
): Promise<PlatformStats[]> => {
  // Mock data
  const platforms = [
    'Google Serp',
    'App Store',
    'Google Play',
    'Trustpilot',
    'Reddit',
    'Instagram',
    'Quora',
  ];

  const totalMentions = platforms.reduce((sum, _, index) => {
    return sum + (Math.floor(Math.random() * 500) + 100);
  }, 0);

  return platforms.map((platform) => {
    const count = Math.floor(Math.random() * 500) + 100;
    return {
      platform,
      count,
      percentage: (count / totalMentions) * 100,
    };
  });

  // return apiClient.post('/api/analytics/platform-stats', dateRange);
};

export const getTopIssues = async (
  dateRange: AnalyticsDateRange
): Promise<TopIssue[]> => {
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

  return issues.map((issue) => ({
    issue_category: issue.title.toLowerCase().replace(/\s+/g, '_'),
    title: issue.title,
    description: issue.description,
    priority: issue.priority,
    total_mentions: Math.floor(Math.random() * 100) + 20,
    priority_breakdown: {
      critical:
        issue.priority === 'critical' ? Math.floor(Math.random() * 50) + 10 : 0,
      high:
        issue.priority === 'high'
          ? Math.floor(Math.random() * 50) + 10
          : Math.floor(Math.random() * 30) + 5,
      medium:
        issue.priority === 'medium'
          ? Math.floor(Math.random() * 50) + 10
          : Math.floor(Math.random() * 30) + 5,
    },
    representative_platforms: ['App Store', 'Reddit', 'Google Play'],
    recent_examples: [
      {
        content: `Example mention about ${issue.title.toLowerCase()}`,
        platform: 'App Store',
        date: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        priority: issue.priority,
      },
    ],
  }));

  // return apiClient.post('/api/analytics/top-issues', dateRange);
};

export const getTopicAnalysis = async (
  dateRange: AnalyticsDateRange
): Promise<TopicAnalysis[]> => {
  // Mock data
  const topics = [
    'Performance',
    'Features',
    'Support',
    'Pricing',
    'UI/UX',
    'Bugs',
    'Security',
  ];
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
      'Google Serp': 45,
      'App Store': 89,
      'Google Play': 76,
      Trustpilot: 34,
      Instagram: 21,
      Reddit: 32,
      Quora: 17,
    },
  };

  // return apiClient.post('/api/analytics/response-metrics', dateRange);
};
