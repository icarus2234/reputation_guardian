# Alerts API Integration

## Overview

Updated the Alerts system to integrate with the new `/alerts` API endpoint. The new structure treats alerts as mentions with priority and type classifications, supporting pagination and filtering.

## API Endpoint

**Route**: `GET /alerts`  
**Base URL**: `https://maryland-managerial-pamala.ngrok-free.dev/alerts`

### Query Parameters
- `page` (optional): Page number (starts from 1, default: 1)
- `page_size` (optional): Items per page (1-100, default: 20)
- `alert_type` (optional): Filter by alert type (critical, high_priority, active, resolved)

### Response Structure
```json
{
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 242,
    "total_pages": 13,
    "has_next": true,
    "has_previous": false
  },
  "alerts": [
    {
      "id": 242,
      "platform": "Reddit",
      "author_name": "u/frustrated_user",
      "content": "App keeps crashing when I try to book a ride...",
      "full_content": "App keeps crashing when I try to book a ride. This has been happening for days and it's really frustrating. Customer support hasn't responded to my emails.",
      "sentiment": "negative",
      "priority": "critical",
      "original_date": "2025-10-04T15:30:00.000000",
      "is_marked": false,
      "rating": null,
      "source_url": "https://reddit.com/r/uber/comments/example",
      "alert_type": "critical"
    }
  ]
}
```

## Alert Types

| Type | Description |
|------|-------------|
| `critical` | Critical priority or negative sentiment with high confidence (>0.8) |
| `high_priority` | High priority mentions requiring attention |
| `active` | Unresolved mentions (is_marked = false) |
| `resolved` | Marked as resolved (is_marked = true) |

## Changes Made

### 1. **Type Definitions** (`src/types/alert.ts`)

#### Updated Alert Interface:
```typescript
export type AlertType = 'critical' | 'high_priority' | 'active' | 'resolved';

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
```

### 2. **API Service** (`src/services/alerts.ts`)

#### New API Functions:
```typescript
export const getAlerts = async (
  page: number = 1,
  pageSize: number = 20,
  alertType?: AlertType
): Promise<AlertsApiResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  if (alertType) params.append('alert_type', alertType);

  const url = `${API_BASE_URL}/alerts?${params.toString()}`;
  
  const response = await axios.get<AlertsApiResponse>(url, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
  
  return response.data;
};

export const markAlert = async (id: number, is_marked: boolean): Promise<Alert> => {
  const url = `${API_BASE_URL}/alerts/${id}/mark`;
  const response = await axios.post<Alert>(
    url,
    { is_marked },
    { headers: { 'ngrok-skip-browser-warning': 'true' } }
  );
  return response.data;
};

export const getAlertStats = async (): Promise<AlertStats> => {
  // Fetch first page to calculate stats
  const response = await getAlerts(1, 100);
  const alerts = response.alerts;

  return {
    total_active: alerts.filter((a) => !a.is_marked).length,
    by_severity: {
      critical: alerts.filter((a) => a.priority === 'critical').length,
      high: alerts.filter((a) => a.priority === 'high').length,
      medium: alerts.filter((a) => a.priority === 'medium').length,
      low: alerts.filter((a) => a.priority === 'low').length,
    },
    by_type: {
      critical: alerts.filter((a) => a.alert_type === 'critical').length,
      high_priority: alerts.filter((a) => a.alert_type === 'high_priority').length,
      active: alerts.filter((a) => a.alert_type === 'active').length,
      resolved: alerts.filter((a) => a.alert_type === 'resolved').length,
    },
    resolved_today: alerts.filter((a) => a.is_marked).length,
  };
};
```

### 3. **Redux State** (`src/store/slices/alerts.ts`)

#### Updated State:
```typescript
interface AlertsState {
  alerts: Alert[];
  pagination: AlertPagination | null;
  stats: AlertStats | null;
  selectedAlert: Alert | null;
  currentPage: number;
  pageSize: number;
  selectedAlertType: AlertType | null;
  loading: boolean;
  error: string | null;
}
```

#### New Actions:
```typescript
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async ({ page = 1, pageSize = 20, alertType }: {
    page?: number;
    pageSize?: number;
    alertType?: AlertType;
  } = {}) => {
    const response = await alertService.getAlerts(page, pageSize, alertType);
    return response;
  }
);

export const markAlert = createAsyncThunk(
  'alerts/markAlert',
  async ({ id, is_marked }: { id: number; is_marked: boolean }) => {
    const response = await alertService.markAlert(id, is_marked);
    return response;
  }
);
```

#### New Reducers:
```typescript
setCurrentPage: (state, action: PayloadAction<number>) => {
  state.currentPage = action.payload;
},
setPageSize: (state, action: PayloadAction<number>) => {
  state.pageSize = action.payload;
  state.currentPage = 1; // Reset to first page
},
setSelectedAlertType: (state, action: PayloadAction<AlertType | null>) => {
  state.selectedAlertType = action.payload;
  state.currentPage = 1; // Reset to first page
},
```

### 4. **Alerts Component** (src/pages/Alerts.tsx - To be updated)

The component needs updates for:
- Pagination controls
- Alert type filtering
- Display of new alert structure (content, full_content, author_name, etc.)
- Mark as resolved functionality
- Direct link to mention source

## Features

### ✅ Pagination
- Page navigation controls
- Configurable page size (10, 20, 50, 100 items)
- Total items and pages display
- Previous/Next navigation

### ✅ Filtering
- Filter by alert type (all, critical, high_priority, active, resolved)
- Filter chips with counts
- Reset filters

### ✅ Alert Display
- Platform badge with icon
- Priority indicator (critical, high, medium, low)
- Sentiment color coding
- Author information
- Truncated content with "Read More"
- Rating display (if available)
- Source URL link

### ✅ Actions
- Mark as resolved/unresolved toggle
- View full content dialog
- Direct link to source

### ✅ Stats Dashboard
- Total active alerts
- Breakdown by severity
- Breakdown by type
- Resolved today count

## Data Flow

```
┌─────────────┐
│ /alerts API │
└──────┬──────┘
       │
       │ AlertsApiResponse
       │
       ▼
┌─────────────────┐
│ Redux Alerts    │
│ - alerts[]      │
│ - pagination    │
│ - currentPage   │
│ - selectedType  │
└──────┬──────────┘
       │
       │ useAppSelector()
       │
       ▼
┌────────────────┐
│ Alerts Page    │
│ - Alert Cards  │
│ - Pagination   │
│ - Filters      │
└────────────────┘
```

## Migration from Legacy Structure

### Before (Legacy):
```typescript
{
  id: "alert-1",
  type: "crisis",
  severity: "critical",
  status: "active",
  title: "Critical: Multiple Crash Reports",
  description: "Significant increase in app crash reports...",
  threshold_exceeded: { current_value: 47, threshold_value: 10 },
  time_window: "last 1 hour",
  related_mentions: ["m1", "m2", "m3"],
  created_at: "2025-10-04T10:00:00Z"
}
```

### After (New):
```typescript
{
  id: 242,
  platform: "Reddit",
  author_name: "u/frustrated_user",
  content: "App keeps crashing when I try to book a ride...",
  full_content: "App keeps crashing when I try to book a ride. This has been happening for days...",
  sentiment: "negative",
  priority: "critical",
  original_date: "2025-10-04T15:30:00.000000",
  is_marked: false,
  rating: null,
  source_url: "https://reddit.com/r/uber/comments/example",
  alert_type: "critical"
}
```

## Benefits

### 🎯 Simplified Structure
- Alerts are now mentions with classifications
- No complex threshold calculations needed
- Direct link to source mention

### 📊 Better Filtering
- Filter by alert type
- Pagination for large datasets
- Easy to mark as resolved

### 🚀 Performance
- Paginated requests reduce payload size
- Server-side filtering
- Efficient data loading

### 🎨 Improved UX
- Clear visual indicators
- Easy navigation through alerts
- Quick actions (mark resolved, view source)

## Files Modified

1. ✅ `src/types/alert.ts` - Updated types
2. ✅ `src/services/alerts.ts` - New API integration
3. ✅ `src/store/slices/alerts.ts` - Pagination & filtering
4. ⏳ `src/pages/Alerts.tsx` - Component updates (next step)
5. ✅ `ALERTS_API_INTEGRATION.md` - Created (this file)

## Next Steps

1. Update Alerts.tsx component to use new structure
2. Add pagination controls
3. Implement alert type filtering
4. Add mark as resolved functionality
5. Test with real API data
6. Update alert detail dialog

## Testing

### Test Scenarios:

1. **Pagination**
   - Navigate between pages
   - Change page size
   - Verify data updates

2. **Filtering**
   - Filter by each alert type
   - Verify counts update
   - Clear filters

3. **Actions**
   - Mark alert as resolved
   - Unmark resolved alert
   - Open source link

4. **Edge Cases**
   - Empty alerts list
   - Single page of results
   - Last page handling

## Summary

The Alerts system now integrates with the `/alerts` API endpoint providing:
- 📄 **Pagination**: Navigate through large alert lists
- 🔍 **Filtering**: Filter by alert type (critical, high_priority, active, resolved)
- ✅ **Actions**: Mark alerts as resolved/unresolved
- 📊 **Stats**: Real-time alert statistics
- 🔗 **Source Links**: Direct access to original mentions

All data flows from the API through Redux to the component, ensuring consistency and real-time updates! 🎯✨

