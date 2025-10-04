# Analytics Page API Integration

## Overview

Updated the Analytics page to integrate with the new `/analytics` API endpoint, replacing mock data with real analytics including sentiment by platform, topic analysis radar charts, and detailed topic breakdowns.

## API Endpoint

**Route**: `GET /analytics`  
**Base URL**: `https://maryland-managerial-pamala.ngrok-free.dev/analytics`

### Query Parameters
- `product_id` (optional): Product ID to filter by
- `days_back` (optional): Number of days to look back (default: 30)

### Response Structure
```json
{
  "analytics_data": {
    "generated_at": "2025-10-04T16:46:14.712259",
    "product_id": null,
    "time_period_days": 30,
    "total_mentions": 242,
    "recent_mentions": 207,
    "previous_period_mentions": 8
  },
  "sentiment_by_platform": {
    "platforms": [
      {
        "platform": "Reddit",
        "counts": { "positive": 0, "negative": 0, "neutral": 235, "total": 235 },
        "percentages": { "positive": 0.0, "negative": 0.0, "neutral": 100.0 }
      }
    ],
    "total_platforms": 4,
    "overall_sentiment": { "positive": 0.0, "negative": 0.0, "neutral": 100.0 }
  },
  "topic_analysis": {
    "chart_type": "radar",
    "chart_data": {
      "categories": ["Performance", "Features", "Support", "Pricing", "UI/UX", "Bugs", "Security"],
      "values": [27.1, 28.0, 47.3, 57.0, 64.7, 31.9, 22.2],
      "detailed_scores": { ... }
    },
    "max_value": 100
  },
  "detailed_topic_analysis": [
    {
      "topic": "Security",
      "mentions": 23,
      "sentiment": "+0.0%",
      "sentiment_raw": 0.0,
      "trend": "+100.0%",
      "trend_raw": 100,
      "sentiment_breakdown": { "positive": 0, "negative": 0, "neutral": 23 },
      "change_from_previous": {
        "current_mentions": 23,
        "previous_mentions": 0,
        "absolute_change": 23
      },
      "priority": 3
    }
  ]
}
```

## Changes Made

### 1. **Type Definitions** (`src/types/analytics.ts`)

Added new interfaces for Analytics page:

```typescript
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
  analytics_data: { ... };
  sentiment_by_platform: { ... };
  topic_analysis: TopicRadarData;
  detailed_topic_analysis: DetailedTopicAnalysis[];
}
```

### 2. **API Service** (`src/services/analytics.ts`)

Added new API call:

```typescript
export const getAnalyticsData = async (
  productId: number = 1,
  daysBack: number = 30
): Promise<AnalyticsApiResponse> => {
  const params = new URLSearchParams();
  if (productId) params.append('product_id', productId.toString());
  if (daysBack) params.append('days_back', daysBack.toString());

  const url = `${API_BASE_URL}/analytics${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await axios.get<AnalyticsApiResponse>(url, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
  
  return response.data;
};
```

### 3. **Redux State** (`src/store/slices/analytics.ts`)

#### Added to State:
```typescript
interface AnalyticsState {
  // ... existing fields
  platformSentimentData: PlatformSentimentData[];
  radarChartData: { category: string; value: number }[];
  detailedTopics: DetailedTopicAnalysis[];
}
```

#### Added Async Thunk:
```typescript
export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchAnalyticsData',
  async ({ productId = 1, daysBack = 30 } = {}) => {
    const response = await analyticsService.getAnalyticsData(productId, daysBack);
    return response;
  }
);
```

#### Added Reducers:
```typescript
.addCase(fetchAnalyticsData.fulfilled, (state, action) => {
  state.loading = false;
  state.platformSentimentData = action.payload.sentiment_by_platform.platforms;
  
  // Transform radar chart data
  state.radarChartData = action.payload.topic_analysis.chart_data.categories.map((category, index) => ({
    category,
    value: action.payload.topic_analysis.chart_data.values[index],
  }));
  
  state.detailedTopics = action.payload.detailed_topic_analysis;
})
```

### 4. **Analytics Component** (`src/pages/Analytics.tsx`)

#### Updated Data Fetching:
```typescript
const { platformSentimentData, radarChartData, detailedTopics, loading, error } =
  useAppSelector((state) => state.analytics);

useEffect(() => {
  dispatch(fetchAnalyticsData({ productId: 1, daysBack: 30 }));
}, [dispatch]);
```

#### Transformed Data for Charts:
```typescript
// Platform sentiment bar chart
const platformChartData = platformSentimentData.map((platform) => ({
  platform: platform.platform.replace('_', ' '),
  positive: platform.counts.positive,
  negative: platform.counts.negative,
  neutral: platform.counts.neutral,
}));

// Topic radar chart
const topicRadarData = radarChartData.map((item) => ({
  topic: item.category,
  score: item.value,
}));
```

#### Updated Topic Details:
```typescript
{detailedTopics.map((topic) => (
  <Grid item xs={12} md={6} key={topic.topic}>
    <Box>
      <Typography variant="subtitle1" fontWeight="600">
        {topic.topic}
      </Typography>
      <Chip label={`${topic.mentions} mentions`} />
      <Chip label={`Sentiment: ${topic.sentiment}`} />
      <Chip label={`Trend: ${topic.trend}`} />
      <Chip label={`Change: +${topic.change_from_previous.absolute_change}`} />
      
      {/* Sentiment breakdown */}
      <Chip label={`Positive: ${topic.sentiment_breakdown.positive}`} />
      <Chip label={`Neutral: ${topic.sentiment_breakdown.neutral}`} />
      <Chip label={`Negative: ${topic.sentiment_breakdown.negative}`} />
    </Box>
  </Grid>
))}
```

## Visual Components

### 1. **Platform Sentiment Bar Chart** (Left, 8 columns)
- Stacked bar chart showing positive/negative/neutral counts per platform
- Color-coded: Green (positive), Red (negative), Gray (neutral)
- Uses actual mention counts from API

### 2. **Topic Radar Chart** (Right, 4 columns)
- Radar/spider chart with topic categories
- Values from 0-100 showing relative mention frequency
- Categories: Performance, Features, Support, Pricing, UI/UX, Bugs, Security

### 3. **Detailed Topic Analysis** (Full width, 12 columns)
- Grid layout with 2 columns
- Each card shows:
  - Topic name and mention count
  - Sentiment percentage with color coding
  - Trend percentage
  - Absolute change from previous period
  - Sentiment breakdown (positive/neutral/negative counts)

## Features

### ✅ Real-Time Data
- Fetches from actual API endpoint
- No mock data
- Refreshes on page load

### ✅ Loading & Error States
```typescript
if (loading) return <Box>Loading analytics data...</Box>;
if (error) return <Box>Error: {error}</Box>;
```

### ✅ Comprehensive Analytics
- **Platform breakdown**: See sentiment distribution across all platforms
- **Topic radar**: Visual representation of topic coverage
- **Detailed metrics**: Trends, changes, and breakdowns for each topic

### ✅ Enhanced Topic Display
- Sentiment with raw percentage
- Trend with percentage change
- Absolute change from previous period
- Full sentiment breakdown (pos/neutral/neg)

## Data Flow

```
┌─────────────────┐
│  /analytics API │
└────────┬────────┘
         │
         │ AnalyticsApiResponse
         │
         ▼
┌──────────────────────────┐
│  Redux Analytics Slice   │
│  - platformSentimentData │
│  - radarChartData        │
│  - detailedTopics        │
└────────┬─────────────────┘
         │
         │ useAppSelector()
         │
         ▼
┌───────────────────────┐
│  Analytics Component  │
│  - Bar Chart          │
│  - Radar Chart        │
│  - Topic Cards        │
└───────────────────────┘
```

## Benefits

### 🎯 Accurate Data
- Direct from backend analytics engine
- Real mention counts and percentages
- Actual trend calculations

### 📊 Rich Visualizations
- Platform sentiment stacked bars
- Topic coverage radar chart
- Detailed topic breakdowns

### 🚀 Performance
- Efficient data fetching
- Redux state management
- Single API call loads all analytics

### 🎨 User Experience
- Clear visual hierarchy
- Color-coded sentiment indicators
- Comprehensive metrics at a glance

## Testing

### Test Scenarios:

1. **All Neutral Sentiments** (Current data)
   - All platforms show 100% neutral
   - Gray-only bar charts
   - Topic scores vary by mention frequency

2. **Mixed Sentiments**
   - Multiple colors in stacked bars
   - Different sentiment percentages
   - Varied topic trends

3. **High Trends**
   - Large percentage changes (e.g., +1866.7%)
   - Big absolute changes
   - New topics appearing

4. **No Data**
   - Empty state handling
   - Zero mentions
   - Graceful fallbacks

## Files Modified

1. ✅ `src/types/analytics.ts` - Added new interfaces
2. ✅ `src/services/analytics.ts` - Added `getAnalyticsData()`
3. ✅ `src/store/slices/analytics.ts` - Added state & thunk
4. ✅ `src/pages/Analytics.tsx` - Integrated API data
5. ✅ `ANALYTICS_API_INTEGRATION.md` - Created (this file)

## Example Usage

```typescript
// Component automatically fetches on mount
useEffect(() => {
  dispatch(fetchAnalyticsData({ productId: 1, daysBack: 30 }));
}, [dispatch]);

// Access data from Redux
const { platformSentimentData, radarChartData, detailedTopics } =
  useAppSelector((state) => state.analytics);

// Transform for charts
const barData = platformSentimentData.map(p => ({
  platform: p.platform,
  positive: p.counts.positive,
  negative: p.counts.negative,
  neutral: p.counts.neutral
}));
```

## Future Enhancements

1. **Date Range Picker**: Allow users to select custom date ranges
2. **Export Data**: Download analytics as CSV/PDF
3. **Drill-down**: Click topic to see related mentions
4. **Filters**: Filter by platform, sentiment, or topic
5. **Comparisons**: Compare current vs previous period side-by-side
6. **Real-time Updates**: Auto-refresh analytics data
7. **Custom Topics**: Allow users to define custom topic categories

## Summary

The Analytics page now uses the `/analytics` API endpoint to display:
- 🟢 **Platform Sentiment**: Stacked bar chart with actual counts
- 📡 **Topic Radar**: Coverage visualization across categories
- 📋 **Detailed Topics**: Comprehensive breakdown with trends and sentiment

All data flows from the API through Redux to the visualizations, ensuring accuracy and consistency across the application! 📊✨

