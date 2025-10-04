import { Platform, Sentiment } from './mention';

export type AlertType = 'critical' | 'high_priority' | 'active' | 'resolved';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';

export interface Alert {
  id: number;
  platform: string;
  author_name: string;
  content: string;
  full_content: string;
  sentiment: Sentiment;
  priority: AlertSeverity;
  original_date: string;
  is_marked: boolean;
  rating: number | null;
  source_url: string;
  alert_type: AlertType;
}

// Legacy alert type for backwards compatibility
export interface LegacyAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  platform?: Platform;
  sentiment?: Sentiment;
  threshold_exceeded: {
    current_value: number;
    threshold_value: number;
    metric: string; // e.g., "negative mentions", "crash reports"
  };
  time_window: string; // e.g., "last 1 hour", "last 24 hours"
  related_mentions: string[]; // mention IDs
  created_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
  notes?: string;
}

export interface AlertSettings {
  spike_detection: {
    enabled: boolean;
    threshold: number; // number of mentions
    time_window: number; // minutes
    sentiment_filter: Sentiment[];
  };
  crisis_detection: {
    enabled: boolean;
    threshold: number;
    keywords: string[]; // "crash", "not working", "payment issue"
  };
  platform_specific: Record<
    Platform,
    {
      enabled: boolean;
      threshold: number;
    }
  >;
  notification_channels: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
  };
}

export interface AlertStats {
  total_active: number;
  by_severity: Record<AlertSeverity, number>;
  by_type: Record<AlertType, number>;
  resolved_today: number;
}

export interface AlertPagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface AlertsApiResponse {
  pagination: AlertPagination;
  alerts: Alert[];
}
