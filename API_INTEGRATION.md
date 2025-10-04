# API Integration Guide

## Overview

The Mentions feature has been integrated with the live API at:
```
https://maryland-managerial-pamala.ngrok-free.dev/mentions
```

## Changes Made

### 1. Type Definitions (`src/types/mention.ts`)

Updated to match the API response structure:

- **Platform**: Changed from snake_case (`google_serp`, `app_store`) to proper case (`Google Serp`, `App Store`)
- **Author**: Changed from string to object with `name`, `avatar_url`, `profile_url`
- **Intent**: Added `neutral_mention` type
- **Mention**: Updated fields:
  - `id`: `number | string` (API uses numbers)
  - `author`: Object instead of string
  - `date`: Replaces `created_at`
  - `keywords_matched`: Replaces `keywords`
  - `confidence_score`: Added
  - `response_suggested`: Added with AI suggestions
  - `metadata`: Updated structure with `processed_date`, `source_url`, `external_id`

- **New Interfaces**:
  - `Author`: User information
  - `ResponseSuggestion`: AI-generated response recommendations
  - `PaginationInfo`: Pagination metadata
  - `MentionApiResponse`: Complete API response structure

### 2. Service Layer (`src/services/mentions.ts`)

Completely rewritten to use the real API:

```typescript
const API_BASE_URL = 'https://maryland-managerial-pamala.ngrok-free.dev';

export const getMentions = async (filter, page, pageSize) => {
  // Builds query parameters from filter
  // Calls the API with proper headers (ngrok-skip-browser-warning)
  // Returns mentions and pagination info
};
```

**Features**:
- Query parameter-based filtering
- 1-indexed pagination (API uses page 1, not 0)
- ngrok browser warning bypass
- Proper error handling

### 3. Redux Store (`src/store/slices/mentions.ts`)

Updated to work with 1-indexed pagination:

- Initial page: `1` (was `0`)
- Page size: `10` (was `25`)
- Reset to page `1` when filters or page size change

### 4. Mentions Page (`src/pages/Mentions.tsx`)

**UI Updates**:
- Platform icons and labels updated for new format
- Author field displays `author.name` instead of string
- Date field uses `date` instead of `created_at`
- Source URL from `metadata.source_url`
- Avatar from `author.avatar_url`

**Filter Updates**:
- Platform filter now uses proper case names
- Date range filters prepared (not yet connected to API)
- Apply button triggers filter update

**DataGrid**:
- Viewport-responsive height: `calc(100vh - 320px)`
- Virtualization enabled for performance
- Row height: `52px`
- Column header height: `56px`

## API Endpoints

### GET /mentions

**Query Parameters**:
- `product_id`: Filter by product ID
- `platform`: Filter by platform (e.g., "Reddit", "App Store")
- `sentiment`: Filter by sentiment ("positive", "negative", "neutral")
- `intent`: Filter by intent ("complaint", "question", "recommendation", "neutral_mention")
- `priority`: Filter by priority ("critical", "high", "medium", "low")
- `from_date`: Filter mentions from this date (ISO format: YYYY-MM-DD)
- `to_date`: Filter mentions up to this date (ISO format: YYYY-MM-DD)
- `page`: Page number (1-indexed)
- `page_size`: Items per page

**Response Structure**:
```json
{
  "mentions": [
    {
      "id": 242,
      "platform": "Google Serp",
      "author": {
        "name": "TechNews.com",
        "avatar_url": null,
        "profile_url": null
      },
      "content": "...",
      "sentiment": "neutral",
      "intent": "complaint",
      "priority": "critical",
      "date": "2025-10-04T15:20:41.977242",
      "rating": null,
      "confidence_score": 0.5,
      "keywords_matched": ["app", "billing", "crash"],
      "topics": ["pricing", "bugs"],
      "response_suggested": {
        "should_respond": true,
        "urgency": "critical",
        "recommended_style": "official",
        "response_type": "apology_and_resolution",
        "key_points": [...]
      },
      "metadata": {
        "processed_date": "2025-10-04T12:20:42",
        "source_url": "https://technews.com/uber-issues",
        "external_id": "serp_2"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "page_size": 10,
    "total_items": 242,
    "total_pages": 25,
    "has_next": true,
    "has_prev": false
  },
  "filters_applied": {
    "product_id": null,
    "platform": null,
    "sentiment": null,
    "intent": null,
    "priority": null
  },
  "available_filters": {
    "platforms": ["App Store", "Reddit", "Instagram", ...],
    "sentiments": ["positive", "negative", "neutral"],
    "intents": ["complaint", "question", "recommendation", "neutral"],
    "priorities": ["critical", "high", "medium", "low"]
  }
}
```

## Platform Names Mapping

| Old Format | New Format |
|------------|------------|
| google_serp | Google Serp |
| app_store | App Store |
| google_play | Google Play |
| trustpilot | Trustpilot |
| facebook | Facebook |
| instagram | Instagram |
| reddit | Reddit |
| quora | Quora |
| forum | Forum |

## Filtering Features

### Platform Filter
Select one or multiple platforms to filter mentions. Available platforms:
- App Store
- Reddit
- Instagram
- Google Serp
- Quora
- Google Play
- Trustpilot

### Date Range Filter
Filter mentions by date range using the `Start Date` and `End Date` fields:
- **Start Date (from_date)**: Shows mentions from this date onwards
- **End Date (to_date)**: Shows mentions up to this date
- Dates are sent to the API in YYYY-MM-DD format

### Applying Filters
1. Select your desired filters (platform, date range)
2. Click the **"Apply"** button to fetch filtered results
3. Click the **"Clear"** button to reset all filters

## Testing

To test the integration:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Mentions page**: `http://localhost:3000/mentions`

3. **Test features**:
   - View mentions list
   - Click on mentions to see details
   - Use platform filter
   - Test date range filtering
   - Test pagination (page through results)
   - Click "Clear" to reset filters
   - Click "Generate Response" to navigate to AI response generator

## Known Limitations

1. **Stats Endpoint**: May need to be updated if API structure differs
2. **Mark as Read**: Endpoint called but no local state update (refresh required to see changes)

## Future Enhancements

1. Add real-time updates via WebSocket
2. Implement advanced search with keywords
3. Add bulk operations (mark multiple as read)
4. Export mentions to CSV/Excel
5. Add sentiment and priority filters to UI

## Troubleshooting

### ngrok Browser Warning

The API includes a header to bypass ngrok's browser warning:
```typescript
headers: {
  'ngrok-skip-browser-warning': 'true',
}
```

### CORS Issues

If you encounter CORS errors, the API server needs to allow requests from your origin.

### Type Errors

If you see type errors after pulling updates:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## API Configuration

To change the API base URL, update:

```typescript
// src/services/mentions.ts
const API_BASE_URL = 'https://your-api-url.com';
```

Or use environment variables:

```typescript
const API_BASE_URL = import.meta.env.VITE_MENTIONS_API_URL || 'https://default-url.com';
```

