import { Sentiment, Platform } from './mention';

export interface ReputationScore {
  current_score: number;
  previous_score: number;
  percentage_change: number;
  change_direction: 'increase' | 'decrease' | 'stable';
  change_description: string;
  score_interpretation: {
    status: string;
    description: string;
    action: string;
  };
  current_period: {
    start: string;
    end: string;
    mentions_count: number;
  };
  previous_period: {
    start: string;
    end: string;
    mentions_count: number;
  };
}

export interface SentimentTrend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  sentiment_ratio: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface PlatformStats {
  platform: string;
  count: number;
  percentage: number;
}

export interface TopIssueExample {
  content: string;
  platform: string;
  date: string;
  priority: string;
}

export interface TopIssue {
  issue_category: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  total_mentions: number;
  priority_breakdown: {
    critical: number;
    high: number;
    medium: number;
  };
  representative_platforms: string[];
  recent_examples: TopIssueExample[];
}

export interface TopicAnalysis {
  topic: string;
  count: number;
  sentiment_score: number;
  trend: number; // % change
  keywords: string[];
}

export interface ResponseMetrics {
  total_responses: number;
  avg_response_time: number; // in minutes
  response_rate: number; // percentage
  by_platform: Record<Platform, number>;
}

export interface AnalyticsDateRange {
  start: string;
  end: string;
}

export interface SentimentDistribution {
  counts: {
    positive: number;
    negative: number;
    neutral: number;
  };
  percentages: {
    positive: number;
    negative: number;
    neutral: number;
  };
  total_mentions: number;
  dominant_sentiment: string;
}

export interface PriorityBreakdown {
  priorities: Array<{
    priority: string;
    count: number;
    percentage: number;
  }>;
  total_mentions: number;
  high_priority_count: number;
}

export interface RecentActivity {
  total_recent_mentions: number;
  avg_daily_mentions: number;
  most_active_platform: string;
  most_common_intent: string;
  critical_issues_count: number;
}

export interface DashboardData {
  dashboard_data: {
    generated_at: string;
    product_id: number;
    time_period_days: number;
    total_mentions: number;
    recent_mentions: number;
  };
  top_issues_requiring_attention: TopIssue[];
  sentiment_distribution: SentimentDistribution;
  sentiment_trend: SentimentTrend[];
  reputation_score: ReputationScore;
  platform_distribution: {
    platforms: PlatformStats[];
    total_platforms: number;
  };
  priority_breakdown: PriorityBreakdown;
  recent_activity: RecentActivity;
}

// Analytics Page Specific Types
export interface PlatformSentimentData {
  platform: string;
  counts: {
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  percentages: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface TopicRadarData {
  chart_type: string;
  chart_data: {
    categories: string[];
    values: number[];
    detailed_scores: Record<string, {
      score: number;
      mention_count: number;
      percentage: number;
    }>;
  };
  max_value: number;
  description: string;
}

export interface DetailedTopicAnalysis {
  topic: string;
  mentions: number;
  sentiment: string;
  sentiment_raw: number;
  trend: string;
  trend_raw: number;
  sentiment_breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  change_from_previous: {
    current_mentions: number;
    previous_mentions: number;
    absolute_change: number;
  };
  priority: number;
}

export interface AnalyticsApiResponse {
  analytics_data: {
    generated_at: string;
    product_id: number | null;
    time_period_days: number;
    total_mentions: number;
    recent_mentions: number;
    previous_period_mentions: number;
  };
  sentiment_by_platform: {
    platforms: PlatformSentimentData[];
    total_platforms: number;
    overall_sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  topic_analysis: TopicRadarData;
  detailed_topic_analysis: DetailedTopicAnalysis[];
}
