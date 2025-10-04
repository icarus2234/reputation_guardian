export type Platform =
  | 'App Store'
  | 'Reddit'
  | 'Instagram'
  | 'Google Serp'
  | 'Quora'
  | 'Google Play'
  | 'Trustpilot';

export type Sentiment = 'positive' | 'negative' | 'neutral';

export type Intent =
  | 'complaint'
  | 'question'
  | 'recommendation'
  | 'neutral'
  | 'neutral_mention';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Author {
  name: string;
  avatar_url?: string | null;
  profile_url?: string | null;
}

export interface ResponseSuggestion {
  should_respond: boolean;
  urgency: string;
  recommended_style: string;
  response_type: string;
  key_points: string[];
}

export interface Mention {
  id: number | string;
  platform: Platform;
  author: Author;
  content: string;
  sentiment: Sentiment;
  intent: Intent;
  priority: Priority;
  date: string;
  rating?: number | null;
  confidence_score: number;
  keywords_matched: string[];
  topics: string[];
  response_suggested: ResponseSuggestion;
  is_marked?: boolean;
  metadata: {
    processed_date: string;
    source_url: string;
    external_id: string;
  };
}

export interface MentionFilter {
  product_id?: number;
  platform?: string;
  sentiment?: string;
  intent?: string;
  priority?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
}

export interface PaginationInfo {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface FiltersApplied {
  product_id: number | null;
  platform: string | null;
  sentiment: string | null;
  intent: string | null;
  priority: string | null;
}

export interface AvailableFilters {
  platforms: string[];
  sentiments: string[];
  intents: string[];
  priorities: string[];
}

export interface MentionApiResponse {
  mentions: Mention[];
  pagination: PaginationInfo;
  filters_applied: FiltersApplied;
  available_filters: AvailableFilters;
}

export interface MentionStats {
  total: number;
  by_platform: Record<Platform, number>;
  by_sentiment: Record<Sentiment, number>;
  by_intent: Record<Intent, number>;
  by_priority: Record<Priority, number>;
}
