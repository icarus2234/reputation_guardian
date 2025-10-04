# Dashboard API Integration

## Overview

The Dashboard has been integrated with the live API at:
```
https://maryland-managerial-pamala.ngrok-free.dev/dashboard
```

## API Endpoint

### GET /dashboard

**Query Parameters**:
- `product_id`: Product ID to fetch data for (default: 1)
- `days_back`: Number of days to look back for data (default: 30)

**Example Request**:
```
GET /dashboard?product_id=1&days_back=30
```

## Changes Made

### 1. **Type Definitions** (`src/types/analytics.ts`)

Updated to match the new API response structure:

#### ReputationScore
```typescript
interface ReputationScore {
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
```

#### SentimentTrend
```typescript
interface SentimentTrend {
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
```

#### PlatformStats
```typescript
interface PlatformStats {
  platform: string;  // Changed from Platform enum
  count: number;     // Changed from total_mentions
  percentage: number;
}
```

#### TopIssue
```typescript
interface TopIssue {
  issue_category: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  total_mentions: number;  // Changed from frequency
  priority_breakdown: {
    critical: number;
    high: number;
    medium: number;
  };
  representative_platforms: string[];
  recent_examples: TopIssueExample[];
}
```

#### New Interfaces
- `DashboardData`: Complete API response
- `SentimentDistribution`: Sentiment breakdown with counts and percentages
- `PriorityBreakdown`: Priority distribution
- `RecentActivity`: Recent activity metrics

### 2. **Service Layer** (`src/services/analytics.ts`)

Added new function to fetch dashboard data:

```typescript
export const getDashboardData = async (
  productId: number = 1,
  daysBack: number = 30
): Promise<DashboardData> => {
  const params = new URLSearchParams();
  params.append('product_id', productId.toString());
  params.append('days_back', daysBack.toString());

  const url = `${API_BASE_URL}/dashboard?${params.toString()}`;

  const response = await axios.get<DashboardData>(url, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });

  return response.data;
};
```

### 3. **Redux Store** (`src/store/slices/analytics.ts`)

Added new async thunk:

```typescript
export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchDashboardData',
  async ({ productId = 1, daysBack = 30 } = {}) => {
    const response = await analyticsService.getDashboardData(productId, daysBack);
    return response;
  }
);
```

The thunk automatically populates:
- `reputationScore` from `reputation_score`
- `sentimentTrend` from `sentiment_trend`
- `platformStats` from `platform_distribution.platforms`
- `topIssues` from `top_issues_requiring_attention`

### 4. **Dashboard Utility Functions** (`src/utils/dashboardHelpers.ts`)

Created utility functions for data formatting and display:

```typescript
// Get color based on reputation score (0-100)
export const getScoreColor = (score: number): string

// Get score status badge color
export const getScoreStatusColor = (status: string): MUI color

// Format reputation score for display
export const formatReputationScore = (score: ReputationScore | null)

// Get priority color for badges
export const getPriorityColor = (priority: string): MUI color

// Format large numbers (1.2K, 3.4M)
export const formatNumber = (num: number): string

// Format percentage with decimal places
export const formatPercentage = (value: number, decimals?: number): string

// Calculate sentiment trend direction
export const getSentimentTrend = (current: number, previous: number)
```

### 5. **Dashboard Component** (`src/pages/Dashboard.tsx`)

Updated to use the new API:

**Before**:
```typescript
useEffect(() => {
  dispatch(fetchReputationScore());
  dispatch(fetchSentimentTrend(dateRange));
  dispatch(fetchPlatformStats(dateRange));
  dispatch(fetchTopIssues(dateRange));
  dispatch(fetchAlertStats());
}, [dispatch, dateRange]);
```

**After**:
```typescript
useEffect(() => {
  dispatch(fetchDashboardData({ productId: 1, daysBack: 30 }));
  dispatch(fetchAlertStats());
}, [dispatch]);
```

**Key Changes**:
- Single API call instead of multiple calls
- Reputation score uses `current_score` instead of `score`
- Reputation score uses `change_direction` ('increase'/'decrease') instead of `trend` ('up'/'down')
- Reputation score displays `change_description` directly
- Platform stats use `count` instead of `total_mentions`
- Top issues use `total_mentions` instead of `frequency`
- Top issues key uses `issue_category` with index instead of `id`

## API Response Structure

```json
{
  "dashboard_data": {
    "generated_at": "2024-10-04T15:30:00.000000",
    "product_id": 1,
    "time_period_days": 30,
    "total_mentions": 235,
    "recent_mentions": 180
  },
  "reputation_score": {
    "current_score": 68.5,
    "previous_score": 63.2,
    "percentage_change": 8.4,
    "change_direction": "increase",
    "change_description": "+8.4% from last period"
  },
  "sentiment_trend": [
    {
      "date": "2024-09-04",
      "positive": 3,
      "negative": 5,
      "neutral": 2,
      "total": 10
    }
  ],
  "platform_distribution": {
    "platforms": [
      {
        "platform": "Reddit",
        "count": 85,
        "percentage": 36.2
      }
    ],
    "total_platforms": 5
  },
  "top_issues_requiring_attention": [
    {
      "issue_category": "App Crashing/Technical Issues",
      "title": "App Crashing/Technical Problems",
      "description": "Users reporting crashes, bugs, and technical difficulties",
      "priority": "critical",
      "total_mentions": 28,
      "priority_breakdown": {
        "critical": 15,
        "high": 8,
        "medium": 5
      },
      "representative_platforms": ["App Store", "Google Play", "Reddit"]
    }
  ]
}
```

## Dashboard Metrics Displayed

### 1. **Reputation Score Card** (Enhanced)
- **Current Score**: Displayed with one decimal place (e.g., "68.5")
- **Status Badge**: Shows score interpretation status (GOOD, FAIR, POOR)
- **Trend Icon**: Visual indicator (↑ increase, ↓ decrease, → stable)
- **Change Description**: API-provided text (e.g., "+8.4% from last period")
- **Score Interpretation**: Brief description from API
- **Color Coding**:
  - Green (≥80): Excellent score
  - Orange (60-79): Good score with room for improvement
  - Red (<60): Needs attention

**Data Mapping**:
```typescript
{
  current_score: 68.5,
  previous_score: 63.2,
  percentage_change: 8.4,
  change_direction: "increase",
  change_description: "+8.4% from last period",
  score_interpretation: {
    status: "good",
    description: "Generally positive with improvement opportunities",
    action: "address moderate issues"
  }
}
```

### 2. **Active Alerts Card**
- Total active alerts
- Critical and High priority breakdown
- *(Still using alerts API, not dashboard API)*

### 3. **Sentiment Trend Chart**
- Line chart showing positive/negative/neutral over time
- Last 30 days by default
- Data from `sentiment_trend` array

### 4. **Sentiment Distribution Pie Chart**
- Calculated from sentiment trend data
- Shows total positive, negative, neutral mentions

### 5. **Mentions by Platform Bar Chart**
- Platform names and mention counts
- Data from `platform_distribution.platforms`

### 6. **Top Issues Panel (Right Column)**
- Sticky sidebar with top issues
- Shows up to 10 issues
- Priority badges (critical/high/medium/low)
- Mention count for each issue
- Issue title and description

## Configuration

To change the default parameters:

```typescript
// In Dashboard.tsx useEffect
dispatch(fetchDashboardData({ 
  productId: 1,    // Change product ID
  daysBack: 30     // Change time period
}));
```

## Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Dashboard**: `http://localhost:3000/`

3. **Verify data loads**:
   - Reputation score displays correctly
   - Charts populate with real data
   - Top issues appear in right panel
   - All metrics update from API

## Known Limitations

1. **Alerts Data**: Still uses separate alerts API, not included in dashboard endpoint
2. **Date Range Selector**: Not yet implemented in UI (hardcoded to 30 days)
3. **Real-time Updates**: No auto-refresh, requires page reload
4. **Error States**: Basic error handling, could be enhanced with retry logic

## Future Enhancements

1. Add date range picker in UI
2. Implement auto-refresh every X seconds
3. Add loading states for each widget
4. Add drill-down capability for top issues
5. Export dashboard data to PDF/Excel
6. Add comparison with previous period
7. Implement real-time updates via WebSocket

## Troubleshooting

### Data Not Loading

Check console for errors:
- API endpoint accessibility
- CORS issues
- ngrok headers being sent

### Type Errors

If you see TypeScript errors:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API Configuration

To change the API base URL:

```typescript
// In src/services/analytics.ts
const API_BASE_URL = 'https://your-new-api-url.com';
```

Or use environment variables:

```typescript
const API_BASE_URL = import.meta.env.VITE_DASHBOARD_API_URL || 'https://default-url.com';
```

## Data Flow

```
Dashboard Component
  ↓ dispatch(fetchDashboardData)
Redux Thunk (analytics slice)
  ↓ analyticsService.getDashboardData()
API Service
  ↓ axios.get(dashboard endpoint)
API Response
  ↓ Redux state update
Dashboard Re-renders with new data
```

## Performance Notes

- Single API call reduces network overhead
- Data is cached in Redux store
- No duplicate API calls on re-renders
- Lazy loading for charts (rendered on demand)

## Security

- API calls include ngrok skip header
- No sensitive data in URL parameters
- Product ID validated on backend
- Days back parameter has server-side limits

