# Reputation Guardian - Quick Reference 🛡️

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm run dev

# 3. Open browser to http://localhost:3000
```

**Or use the startup script:**
```bash
./START.sh
```

## 📋 What You Get

### ✅ Complete Features
- ✨ **Dashboard** - Real-time reputation metrics and charts
- 💬 **Mentions** - Browse and filter brand mentions across platforms
- 📊 **Analytics** - Deep dive into sentiment, topics, and trends
- 🤖 **AI Responses** - Generate personalized responses (Official/Friendly/Technical)
- 🚨 **Alerts** - Early warning system for reputation crises
- ⚙️ **Settings** - Configure keywords, thresholds, and notifications

### 🎯 Key Capabilities

| Feature | Description |
|---------|-------------|
| **Multi-Platform** | Google, App Stores, TrustPilot, Social Media, Forums |
| **Sentiment Analysis** | Positive/Negative/Neutral classification |
| **Intent Detection** | Complaint/Question/Recommendation/Neutral |
| **Priority System** | Critical/High/Medium/Low automatic assignment |
| **Response Styles** | Official, Friendly, Technical tones |
| **Languages** | English & Ukrainian (Українська) |
| **Real-time Charts** | Line, Bar, Pie, Radar charts |
| **Early Warnings** | Spike detection & crisis alerts |

## 🗂️ Navigation

| Page | Route | Purpose |
|------|-------|---------|
| **Dashboard** | `/dashboard` | Overview of reputation health |
| **Mentions** | `/mentions` | Browse all brand mentions |
| **Analytics** | `/analytics` | Detailed metrics and trends |
| **Responses** | `/responses` | AI response generator |
| **Alerts** | `/alerts` | Active warnings and crises |
| **Settings** | `/settings` | Configuration and preferences |

## 🎨 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - API client

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview and features |
| `GETTING_STARTED.md` | Detailed setup instructions |
| `PROJECT_OVERVIEW.md` | Architecture and design |
| `QUICK_REFERENCE.md` | This file - quick commands |

## 💻 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## 🎯 Common Tasks

### View Dashboard
1. Start app: `npm run dev`
2. Navigate to: `http://localhost:3000/dashboard`

### Filter Mentions
1. Go to **Mentions** page
2. Use platform/sentiment dropdowns
3. Click "Apply Filters"

### Generate Response
1. Go to **Responses** page
2. Paste mention text
3. Select style (Official/Friendly/Technical)
4. Choose language (EN/UK)
5. Click "Generate Response"

### Check Alerts
1. Go to **Alerts** page
2. Click on any alert for details
3. Acknowledge or resolve alerts

## 🔥 Features Highlights

### Dashboard
- 📈 Reputation score with trend
- 🚨 Active alerts counter
- 💬 Total mentions across platforms
- 📊 Multiple interactive charts
- 🎯 Top 5 issues list

### AI Response Generator
- 🤖 Three response styles
- 🌍 Bilingual support
- ✅ Action checklists
- 📚 FAQ links
- 📋 Copy to clipboard

### Early Warning System
- ⚡ Spike detection
- 🚨 Crisis alerts
- 📊 Threshold tracking
- 📝 Notes and resolution
- 🔔 Real-time notifications

## 📱 Responsive Design

Works perfectly on:
- 💻 Desktop (1920px+)
- 💼 Laptop (1280-1920px)
- 📱 Tablet (600-1280px)
- 📲 Mobile (320-600px)

## 🎓 Learning Path

1. **Start Here**: Run `npm start` and explore Dashboard
2. **Browse Data**: Check Mentions page and use filters
3. **Try AI**: Generate some responses with different styles
4. **View Analytics**: Explore charts and metrics
5. **Check Code**: Review well-structured source files

## 🛠️ Troubleshooting

### Port 3000 in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Dependencies issues?
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?
```bash
# Clear cache
rm -rf node_modules/.cache
npm run dev
```

## 🌟 Pro Tips

1. **Mock Data**: App uses realistic mock data - no backend needed!
2. **Responsive**: Resize browser to see responsive design
3. **Charts**: Hover over charts for detailed tooltips
4. **Filters**: Combine multiple filters for precise results
5. **Examples**: Use quick examples in Response Generator
6. **Alerts**: Check header badge for active alert count

## 📞 File Structure Overview

```
src/
├── components/    # UI components (Header, Sidebar, Layout)
├── pages/        # Main pages (Dashboard, Mentions, etc.)
├── services/     # API calls and mock data
├── store/        # Redux state management
├── types/        # TypeScript type definitions
├── utils/        # Helper functions
└── theme/        # MUI theme configuration
```

## 🚀 Next Steps

After exploring the app:

1. **Customize**: Edit theme in `src/theme/index.ts`
2. **Extend**: Add new features to existing pages
3. **Connect API**: Replace mock data with real API calls
4. **Deploy**: Run `npm run build` for production

## 💡 Key Insights

- **No Backend Required**: Fully functional with mock data
- **Production Ready**: Professional UI and architecture
- **Type Safe**: TypeScript prevents bugs
- **Scalable**: Modular design for easy expansion
- **Well Documented**: Comprehensive comments and docs

---

## 🎉 You're Ready to Go!

Just run `npm run dev` and explore the application. Everything is pre-configured and ready to use!

**Need Help?**
- Check `GETTING_STARTED.md` for detailed setup
- Review `PROJECT_OVERVIEW.md` for architecture details
- Explore code comments for inline documentation

**Enjoy monitoring your brand reputation! 🛡️✨**

