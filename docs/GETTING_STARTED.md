# Getting Started with Reputation Guardian

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- A code editor (VS Code recommended)

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- Recharts
- Axios
- And more...

### 2. Environment Setup

The application is pre-configured to work with mock data, so you can start it immediately without any backend API. However, if you want to connect to a real backend API in the future:

1. Create a `.env` file in the root directory (optional):

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
REACT_APP_ENABLE_DARK_MODE=true
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will automatically open in your browser at [http://localhost:3000](http://localhost:3000)

## 📱 Application Structure

### Main Features:

1. **Dashboard** (`/dashboard`)
   - Real-time reputation score
   - Sentiment trends over the last 30 days
   - Platform distribution charts
   - Top issues requiring attention
   - Active alerts summary

2. **Mentions** (`/mentions`)
   - Browse all brand mentions across platforms
   - Advanced filtering by platform, sentiment, intent
   - Search functionality
   - Detailed mention view with full context
   - Quick action buttons for responses

3. **Analytics** (`/analytics`)
   - Deep dive into reputation metrics
   - Sentiment trends over time
   - Platform-specific breakdowns
   - Topic analysis with radar charts
   - Response metrics and performance

4. **Responses** (`/responses`)
   - AI-powered response generator
   - Multiple response styles: Official, Friendly, Technical
   - Multi-language support (English, Ukrainian)
   - Action checklists for each response
   - Quick example templates

5. **Alerts** (`/alerts`)
   - Early warning system for reputation crises
   - Real-time spike detection
   - Critical issue tracking
   - Alert management (acknowledge, resolve, dismiss)
   - Platform-specific alerts

6. **Settings** (`/settings`)
   - Configure brand keywords
   - Enable/disable platforms
   - Set alert thresholds
   - Configure data collection intervals
   - Notification preferences

## 🎨 UI Features

### Modern Design
- Clean, professional interface with Material-UI
- Responsive design for all screen sizes
- Smooth animations and transitions
- Intuitive navigation

### Interactive Charts
- Line charts for sentiment trends
- Pie charts for distribution
- Bar charts for platform comparisons
- Radar charts for topic analysis

### Real-time Updates
- Live data refresh (when connected to backend)
- WebSocket support for instant notifications
- Automatic alert polling

## 🔧 Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Mock Data

The application includes comprehensive mock data to demonstrate all features:

- **Mentions**: Generated with realistic content across all platforms
- **Analytics**: 30 days of sentiment trends and platform statistics
- **Alerts**: Sample crisis and spike alerts
- **Response Generator**: Working AI response simulation

This allows you to explore all features without needing a backend API.

## 🔌 Connecting to a Backend API

To connect to a real backend API:

1. Update the `.env` file with your API URL
2. Modify service files in `src/services/` to use real API calls
3. Remove or comment out mock data generation
4. Ensure CORS is properly configured on your backend

### Expected API Endpoints:

```
GET    /api/mentions              # List mentions
POST   /api/mentions/search       # Search with filters
GET    /api/analytics/score       # Reputation score
GET    /api/analytics/sentiment   # Sentiment trends
POST   /api/responses/generate    # Generate AI response
GET    /api/alerts                # List alerts
```

## 🎯 Key Technologies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Material-UI v5**: Professional UI components
- **Redux Toolkit**: State management
- **Recharts**: Beautiful, responsive charts
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **date-fns**: Date formatting and manipulation

## 📚 Learning Resources

### React & TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Material-UI
- [MUI Documentation](https://mui.com/)
- [MUI Examples](https://mui.com/material-ui/getting-started/templates/)

### Redux Toolkit
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [Redux Best Practices](https://redux.js.org/style-guide/)

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Then start again
npm start
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm start
```

## 🎓 Next Steps

1. **Explore the Dashboard**: Get familiar with the main metrics and charts
2. **Filter Mentions**: Try different filters to see how the data updates
3. **Generate Responses**: Test the AI response generator with different styles
4. **Review Alerts**: Check how the early warning system works
5. **Customize Settings**: Configure thresholds and preferences
6. **Review the Code**: Explore the well-structured codebase to understand the architecture

## 💡 Tips

- Use the sidebar to navigate between different sections
- Click on mentions to see detailed information
- Try different response styles in the Response Generator
- Monitor the alert badge in the header for active alerts
- All data is currently mock data - perfect for testing and demos

## 🤝 Need Help?

- Check the main [README.md](./README.md) for more information
- Review component documentation in the code
- Check browser console for any errors
- Ensure all dependencies are properly installed

## 🎉 You're Ready!

You now have a fully functional Reputation Guardian system running locally. Explore all the features and see how it can help monitor and manage brand reputation effectively!

