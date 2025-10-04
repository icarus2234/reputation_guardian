#!/bin/bash

echo "🛡️  Reputation Guardian - Starting Application"
echo "================================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version is below 18. Please upgrade to Node 18+."
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "   This may take a few minutes on first run..."
    npm install
    echo ""
fi

echo "🚀 Starting development server..."
echo "   The app will open at http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "   - Quick Start: See GETTING_STARTED.md"
echo "   - Full Overview: See PROJECT_OVERVIEW.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

# Start the app
npm run dev

