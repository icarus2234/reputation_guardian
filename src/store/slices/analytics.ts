import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ReputationScore,
  SentimentTrend,
  PlatformStats,
  TopIssue,
  TopicAnalysis,
  ResponseMetrics,
  AnalyticsDateRange,
  DashboardData,
  SentimentDistribution,
  AnalyticsApiResponse,
  PlatformSentimentData,
  DetailedTopicAnalysis,
} from '@/types/analytics';
import * as analyticsService from '@/services/analytics';

interface AnalyticsState {
  reputationScore: ReputationScore | null;
  sentimentTrend: SentimentTrend[];
  sentimentDistribution: SentimentDistribution | null;
  platformStats: PlatformStats[];
  topIssues: TopIssue[];
  topicAnalysis: TopicAnalysis[];
  responseMetrics: ResponseMetrics | null;
  // Analytics page specific data
  platformSentimentData: PlatformSentimentData[];
  radarChartData: { category: string; value: number }[];
  detailedTopics: DetailedTopicAnalysis[];
  dateRange: AnalyticsDateRange;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  reputationScore: null,
  sentimentTrend: [],
  sentimentDistribution: null,
  platformStats: [],
  topIssues: [],
  topicAnalysis: [],
  responseMetrics: null,
  // Analytics page specific data
  platformSentimentData: [],
  radarChartData: [],
  detailedTopics: [],
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
  loading: false,
  error: null,
};

export const fetchReputationScore = createAsyncThunk('analytics/fetchReputationScore', async () => {
  const response = await analyticsService.getReputationScore();
  return response;
});

export const fetchSentimentTrend = createAsyncThunk(
  'analytics/fetchSentimentTrend',
  async (dateRange: AnalyticsDateRange) => {
    const response = await analyticsService.getSentimentTrend(dateRange);
    return response;
  }
);

export const fetchPlatformStats = createAsyncThunk(
  'analytics/fetchPlatformStats',
  async (dateRange: AnalyticsDateRange) => {
    const response = await analyticsService.getPlatformStats(dateRange);
    return response;
  }
);

export const fetchTopIssues = createAsyncThunk(
  'analytics/fetchTopIssues',
  async (dateRange: AnalyticsDateRange) => {
    const response = await analyticsService.getTopIssues(dateRange);
    return response;
  }
);

export const fetchTopicAnalysis = createAsyncThunk(
  'analytics/fetchTopicAnalysis',
  async (dateRange: AnalyticsDateRange) => {
    const response = await analyticsService.getTopicAnalysis(dateRange);
    return response;
  }
);

export const fetchResponseMetrics = createAsyncThunk(
  'analytics/fetchResponseMetrics',
  async (dateRange: AnalyticsDateRange) => {
    const response = await analyticsService.getResponseMetrics(dateRange);
    return response;
  }
);

export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchDashboardData',
  async ({ productId = 1, daysBack = 30 }: { productId?: number; daysBack?: number } = {}) => {
    const response = await analyticsService.getDashboardData(productId, daysBack);
    return response;
  }
);

export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchAnalyticsData',
  async ({ productId = 1, daysBack = 30 }: { productId?: number; daysBack?: number } = {}) => {
    const response = await analyticsService.getAnalyticsData(productId, daysBack);
    return response;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reputation Score
      .addCase(fetchReputationScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReputationScore.fulfilled, (state, action) => {
        state.loading = false;
        state.reputationScore = action.payload;
      })
      .addCase(fetchReputationScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reputation score';
      })
      // Sentiment Trend
      .addCase(fetchSentimentTrend.fulfilled, (state, action) => {
        state.sentimentTrend = action.payload;
      })
      // Platform Stats
      .addCase(fetchPlatformStats.fulfilled, (state, action) => {
        state.platformStats = action.payload;
      })
      // Top Issues
      .addCase(fetchTopIssues.fulfilled, (state, action) => {
        state.topIssues = action.payload;
      })
      // Topic Analysis
      .addCase(fetchTopicAnalysis.fulfilled, (state, action) => {
        state.topicAnalysis = action.payload;
      })
      // Response Metrics
      .addCase(fetchResponseMetrics.fulfilled, (state, action) => {
        state.responseMetrics = action.payload;
      })
      // Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Redux: Dashboard data received:', action.payload);
        
        // Map API response to state
        state.reputationScore = action.payload.reputation_score;
        state.sentimentTrend = action.payload.sentiment_trend || [];
        state.sentimentDistribution = action.payload.sentiment_distribution;
        state.platformStats = action.payload.platform_distribution?.platforms || [];
        state.topIssues = action.payload.top_issues_requiring_attention || [];
        
        console.log('Redux: State updated:', {
          reputationScore: state.reputationScore,
          sentimentTrendCount: state.sentimentTrend.length,
          sentimentDistribution: state.sentimentDistribution,
          platformStatsCount: state.platformStats.length,
          topIssuesCount: state.topIssues.length,
        });
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
        console.error('Redux: Dashboard data fetch failed:', action.error);
      })
      // Analytics Data
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Redux: Analytics data received:', action.payload);
        
        // Map API response to state
        state.platformSentimentData = action.payload.sentiment_by_platform.platforms;
        
        // Transform radar chart data
        state.radarChartData = action.payload.topic_analysis.chart_data.categories.map((category, index) => ({
          category,
          value: action.payload.topic_analysis.chart_data.values[index],
        }));
        
        state.detailedTopics = action.payload.detailed_topic_analysis;
        
        console.log('Redux: Analytics state updated:', {
          platformSentimentDataCount: state.platformSentimentData.length,
          radarChartDataCount: state.radarChartData.length,
          detailedTopicsCount: state.detailedTopics.length,
        });
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics data';
        console.error('Redux: Analytics data fetch failed:', action.error);
      });
  },
});

export const { setDateRange, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
