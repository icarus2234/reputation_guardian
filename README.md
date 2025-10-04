# 🛡️ Reputation Guardian

> **A comprehensive brand reputation monitoring and management platform**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14.20-blue.svg)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0.1-purple.svg)](https://redux-toolkit.js.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green.svg)](https://openai.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Integration](#api-integration)
- [AI-Powered Features](#ai-powered-features)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Reputation Guardian is a modern, AI-powered brand reputation monitoring and management platform designed to help businesses track, analyze, and respond to online mentions across multiple platforms. The platform provides real-time insights, automated response generation, and comprehensive analytics to protect and enhance your brand's online reputation.

### Key Capabilities

- **Real-time Monitoring**: Track mentions across 7+ major platforms
- **AI-Powered Insights**: Generate actionable insights using OpenAI GPT-4o-mini
- **Smart Response Generation**: Automated response creation with sentiment analysis
- **Comprehensive Analytics**: Detailed reporting and trend analysis
- **Alert System**: Early warning system for critical issues
- **Multi-language Support**: English and Ukrainian language support

## ✨ Features

### 📊 Dashboard

- **Reputation Score**: Real-time reputation scoring with visual indicators
- **Sentiment Trends**: Historical sentiment analysis with interactive charts
- **Platform Distribution**: Visual breakdown of mentions by platform
- **Top Issues**: Critical issues requiring immediate attention
- **AI Insights**: Automated insights generation with caching

### 💬 Mentions Management

- **Unified View**: All mentions from different platforms in one place
- **Advanced Filtering**: Filter by platform, date range, sentiment, and more
- **Platform Icons**: Visual platform identification with tooltips
- **Real-time Updates**: Live updates with loading states
- **Mark as Resolved**: Track resolution status of mentions

### 🤖 AI Response Generation

- **Sentiment-Aware**: Automatic sentiment detection and specialized responses
- **Multiple Styles**: Official, friendly, and technical response styles
- **Best Practices**: Follows 11-step negative review response guidelines
- **Name Recognition**: Extracts and uses reviewer names when available
- **Action Checklists**: Contextual follow-up actions for each response

### 📈 Analytics

- **Platform Sentiment**: Detailed sentiment analysis by platform
- **Topic Analysis**: Radar charts for topic distribution and trends
- **Trend Visualization**: Interactive charts with recharts
- **Export Capabilities**: Data export for further analysis

### 🚨 Alerts System

- **Priority Levels**: Critical, high, medium, and low priority alerts
- **Real-time Notifications**: Immediate alerts for critical issues
- **Resolution Tracking**: Track alert resolution status
- **Loading States**: Comprehensive loading states for all operations

## 🛠 Technology Stack

### Frontend

- **React 18.2.0** - Modern React with hooks and functional components
- **TypeScript 5.3.3** - Type-safe development
- **Material-UI 5.14.20** - Modern UI component library
- **Redux Toolkit 2.0.1** - State management
- **React Router 6.20.1** - Client-side routing
- **Recharts 2.10.3** - Data visualization
- **Axios 1.6.2** - HTTP client
- **Date-fns 2.30.0** - Date manipulation

### AI & Integration

- **OpenAI 6.1.0** - AI response generation
- **Socket.io 4.7.2** - Real-time communication
- **RESTful APIs** - Backend integration

### Development Tools

- **Vite 5.0.8** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **pnpm** package manager
- **OpenAI API Key** (for AI features)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reputation-guardian
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Add your OpenAI API key:

   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Alternative Setup

Use the provided setup script:

```bash
chmod +x START.sh
./START.sh
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# API Endpoints (optional - defaults to relative paths)
VITE_API_BASE_URL=https://your-api-domain.com

# Development Settings
VITE_DEV_MODE=true
```

### API Configuration

The platform integrates with the following API endpoints:

- **Mentions**: `/mentions` - Fetch and manage mentions
- **Dashboard**: `/dashboard` - Dashboard data and insights
- **Analytics**: `/analytics` - Analytics and reporting data
- **Alerts**: `/alerts` - Alert system data

### OpenAI Setup

1. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account or sign in
   - Navigate to API Keys section
   - Create a new API key

2. **Configure the Application**
   - Add the API key to your `.env` file
   - The application will automatically use it for AI features

3. **Supported Models**
   - **Primary**: GPT-4o-mini (cost-effective and fast)
   - **Temperature**: 0.7 (balanced creativity and consistency)
   - **Max Tokens**: 500 (optimal for response length)

## 📱 Usage

### Dashboard Overview

The dashboard provides a comprehensive view of your brand's reputation:

1. **Reputation Score Card**
   - Current reputation score with color-coded indicators
   - Historical trend visualization
   - Platform-specific breakdowns

2. **Sentiment Trend Chart**
   - Interactive line chart showing sentiment over time
   - Positive, negative, and neutral sentiment tracking
   - Zoom and pan capabilities

3. **Platform Distribution**
   - Pie chart showing mention distribution across platforms
   - Click to filter by specific platforms
   - Real-time updates

4. **Top Issues Section**
   - Critical issues requiring immediate attention
   - Sticky positioning for easy access
   - Priority-based sorting

5. **AI Insights**
   - Auto-generated insights on page load
   - Executive summary and key findings
   - Detailed recommendations and urgent actions
   - Local storage caching for performance

### Mentions Management

1. **Viewing Mentions**
   - Scrollable list with virtualization for performance
   - Platform icons with tooltips
   - Author information and content preview
   - Date and sentiment indicators

2. **Filtering Mentions**
   - Platform filters (App Store, Reddit, Instagram, etc.)
   - Date range selection
   - Sentiment filters
   - Apply/Clear buttons for easy management

3. **Mention Details**
   - Full content display
   - Author profile information
   - Source URL and metadata
   - Response suggestions

4. **Mark as Resolved**
   - One-click resolution tracking
   - Loading states for better UX
   - Automatic list refresh

### AI Response Generation

1. **Generate Response**
   - Click "Generate Response" from mentions page
   - Automatic redirect to Responses tab with prefilled data
   - Context-aware response generation

2. **Response Customization**
   - **Style Selection**: Official, Friendly, or Technical
   - **Language**: English or Ukrainian
   - **Custom Instructions**: Additional context for AI

3. **Negative Review Handling**
   The system automatically detects negative sentiment and applies specialized guidelines:
   - Personal addressing with reviewer names
   - Sincere apologies and responsibility taking
   - Explanations without excuses
   - Solution offers and second chances
   - Contact information for further discussion

4. **Send Response**
   - Review generated response
   - Send to platform
   - Mark mention as resolved
   - Navigate back to mentions

### Analytics & Reporting

1. **Platform Sentiment Analysis**
   - Detailed sentiment breakdown by platform
   - Average sentiment scores
   - Mention counts and percentages

2. **Topic Analysis**
   - Radar chart visualization
   - Topic frequency and trends
   - Related mention tracking

3. **Export Options**
   - CSV export for further analysis
   - PDF reports (planned feature)
   - API access for custom integrations

### Alerts Management

1. **Alert Types**
   - **Critical**: Immediate attention required
   - **High Priority**: Important issues to address
   - **Medium**: Standard priority items
   - **Low**: Informational alerts

2. **Alert Actions**
   - **Acknowledge**: Mark as reviewed
   - **Resolve**: Mark as completed
   - **Dismiss**: Archive without action

3. **Real-time Updates**
   - Live alert notifications
   - Automatic refresh on actions
   - Loading states for all operations

## 🔌 API Integration

### Endpoints

#### Mentions API

```typescript
GET / mentions;
POST / mentions / { id } / mark;
GET / mentions / { id };
GET / mentions / stats;
```

#### Dashboard API

```typescript
GET / dashboard;
```

#### Analytics API

```typescript
GET / analytics;
```

#### Alerts API

```typescript
GET / alerts;
POST / alerts / { id } / acknowledge;
POST / alerts / { id } / resolve;
DELETE / alerts / { id };
```

### Data Models

#### Mention

```typescript
interface Mention {
  id: number;
  platform: Platform;
  author: Author;
  content: string;
  full_content: string;
  sentiment: Sentiment;
  intent: Intent;
  priority: Priority;
  original_date: string;
  is_read: boolean;
  is_marked?: boolean;
  rating?: number;
  source_url: string;
  topics?: string[];
  response_suggestion?: ResponseSuggestion;
}
```

#### Alert

```typescript
interface Alert {
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
  time_window: string;
}
```

### Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Graceful fallbacks and retry mechanisms
- **API Errors**: User-friendly error messages
- **Loading States**: Visual feedback for all async operations
- **Empty States**: Helpful messages when no data is available

## 🤖 AI-Powered Features

### Sentiment Analysis

Automatic sentiment detection using keyword analysis:

```typescript
const detectSentiment = (
  content: string
): 'negative' | 'positive' | 'neutral' => {
  // Comprehensive keyword matching
  // Context-aware analysis
  // Confidence scoring
};
```

### Response Generation

AI-powered response generation with multiple features:

1. **Context Awareness**
   - Mention content analysis
   - Platform-specific considerations
   - Historical context

2. **Style Adaptation**
   - Official: Formal and professional
   - Friendly: Warm and conversational
   - Technical: Detailed and solution-focused

3. **Best Practices Integration**
   - 11-step negative review guidelines
   - Industry-standard response templates
   - Personalization techniques

4. **Multi-language Support**
   - English responses
   - Ukrainian responses
   - Language-specific cultural considerations

### Action Checklists

Contextual action suggestions based on sentiment and content:

- **Negative Reviews**: Escalation, follow-up, compensation
- **Positive Reviews**: Thanks, sharing, testimonials
- **Questions**: Documentation, support, resources

### Caching System

AI insights are cached for performance:

- **Local Storage**: Client-side caching
- **Data Hashing**: Change detection
- **24-hour Expiration**: Automatic refresh
- **Manual Refresh**: Force regeneration

## 📁 Project Structure

```
reputation-guardian/
├── public/                     # Static assets
│   ├── logo.png               # Main logo
│   ├── manifest.json          # PWA manifest
│   └── robots.txt             # SEO robots file
├── src/
│   ├── components/            # Reusable components
│   │   └── layout/           # Layout components
│   │       ├── Header.tsx    # Navigation header
│   │       ├── Layout.tsx    # Main layout wrapper
│   │       └── Sidebar.tsx   # Navigation sidebar
│   ├── pages/                # Page components
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Mentions.tsx      # Mentions management
│   │   ├── Responses.tsx     # AI response generation
│   │   ├── Analytics.tsx     # Analytics and reporting
│   │   ├── Alerts.tsx        # Alert management
│   │   └── Settings.tsx      # Application settings
│   ├── services/             # API and external services
│   │   ├── api.ts           # Base API client
│   │   ├── mentions.ts      # Mentions API service
│   │   ├── responses.ts     # AI response service
│   │   ├── analytics.ts     # Analytics API service
│   │   ├── alerts.ts        # Alerts API service
│   │   └── dashboardInsights.ts # AI insights service
│   ├── store/               # Redux store
│   │   ├── index.ts         # Store configuration
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── slices/          # Redux slices
│   │       ├── mentions.ts  # Mentions state management
│   │       ├── responses.ts # Response state management
│   │       ├── analytics.ts # Analytics state management
│   │       ├── alerts.ts    # Alerts state management
│   │       └── ui.ts        # UI state management
│   ├── types/               # TypeScript type definitions
│   │   ├── mention.ts       # Mention-related types
│   │   ├── response.ts      # Response-related types
│   │   ├── analytics.ts     # Analytics-related types
│   │   └── alert.ts         # Alert-related types
│   ├── utils/               # Utility functions
│   │   ├── constants.ts     # Application constants
│   │   ├── formatters.ts    # Data formatting utilities
│   │   └── dashboardHelpers.ts # Dashboard-specific helpers
│   ├── theme/               # Material-UI theme
│   │   └── index.ts         # Theme configuration
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite environment types
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── START.sh                 # Quick start script
└── README.md                # This file
```

### Key Files

- **`src/App.tsx`**: Main application component with routing
- **`src/pages/Dashboard.tsx`**: Comprehensive dashboard with AI insights
- **`src/services/responses.ts`**: AI response generation with sentiment analysis
- **`src/store/slices/`**: Redux state management for all features
- **`src/types/`**: TypeScript definitions for all data models

## 💻 Development

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Code Quality

The project uses several tools to maintain code quality:

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **React Hooks**: Modern React patterns

### Development Guidelines

1. **TypeScript First**
   - Use TypeScript for all new code
   - Define interfaces for all data structures
   - Avoid `any` types

2. **Component Structure**
   - Use functional components with hooks
   - Implement proper loading and error states
   - Follow Material-UI design patterns

3. **State Management**
   - Use Redux Toolkit for global state
   - Implement proper async thunks
   - Handle loading and error states

4. **API Integration**
   - Use typed API clients
   - Implement proper error handling
   - Add loading states for all operations

### Testing

Testing setup (to be implemented):

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# The build output will be in the `dist/` directory
```

### Environment Configuration

For production deployment:

1. **Set Environment Variables**

   ```env
   VITE_OPENAI_API_KEY=your_production_api_key
   VITE_API_BASE_URL=https://your-production-api.com
   VITE_DEV_MODE=false
   ```

2. **Configure API Endpoints**
   - Update API base URL for production
   - Ensure CORS is properly configured
   - Set up proper authentication

### Deployment Options

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimization

The application includes several performance optimizations:

- **Code Splitting**: Lazy loading for routes
- **Virtualization**: Efficient rendering of large lists
- **Caching**: AI insights and API responses
- **Optimized Bundles**: Tree shaking and minification

## 🤝 Contributing

We welcome contributions to Reputation Guardian! Here's how you can help:

### Getting Started

1. **Fork the Repository**

   ```bash
   git clone https://github.com/your-username/reputation-guardian.git
   cd reputation-guardian
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the coding guidelines
   - Add tests for new features
   - Update documentation

4. **Submit a Pull Request**
   - Provide a clear description
   - Link to related issues
   - Ensure all tests pass

### Contribution Guidelines

1. **Code Style**
   - Use TypeScript for all new code
   - Follow ESLint and Prettier configurations
   - Write meaningful commit messages

2. **Testing**
   - Add unit tests for new features
   - Ensure existing tests pass
   - Test in multiple browsers

3. **Documentation**
   - Update README for significant changes
   - Add JSDoc comments for new functions
   - Update type definitions

### Reporting Issues

When reporting issues, please include:

- **Environment**: OS, Node.js version, browser
- **Steps to Reproduce**: Clear reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing powerful AI capabilities
- **Material-UI** for the comprehensive component library
- **Recharts** for beautiful data visualizations
- **React** and **TypeScript** communities for excellent tooling

## 📞 Support

For support and questions:

- **Documentation**: Check this README and inline comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🔄 Changelog

### Version 1.0.0

- Initial release
- Dashboard with reputation scoring
- Mentions management with filtering
- AI-powered response generation
- Analytics and reporting
- Alert system
- Multi-platform support
- Multi-language support (English/Ukrainian)

---

**Built with ❤️ for protecting your brand's reputation**
