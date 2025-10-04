# OpenAI API Setup Guide

This application uses OpenAI's GPT-4 API to generate intelligent, context-aware responses to customer mentions and reviews.

## Prerequisites

1. An OpenAI account with API access
2. An active OpenAI API key

## Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the generated API key (you won't be able to see it again!)

## Configuration

### Step 1: Create Environment File

Create a `.env` file in the project root:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_actual_openai_api_key_here

# Refresh Intervals (in milliseconds)
VITE_DATA_REFRESH_INTERVAL=30000
VITE_ALERT_REFRESH_INTERVAL=10000
```

### Step 2: Add Your API Key

Replace `your_actual_openai_api_key_here` with your actual OpenAI API key:

```bash
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Development Server

If your development server is running, restart it to load the new environment variables:

```bash
npm run dev
```

## How It Works

The AI Response Generator uses OpenAI's GPT-4o-mini model to:

1. **Analyze customer mentions** - Understanding sentiment, intent, and context
2. **Generate appropriate responses** - Adapting tone and style based on your selection:
   - **Official**: Formal, professional, corporate tone
   - **Friendly**: Warm, approachable, conversational tone
   - **Technical**: Detailed, solution-focused, technical tone
3. **Support multiple languages** - Currently supports English and Ukrainian
4. **Provide context-aware suggestions** - Action checklists and relevant resources

## Response Styles

### Official Style
- Formal and professional
- Suitable for corporate communications
- Respectful and authoritative
- No casual language or emojis

### Friendly Style
- Warm and approachable
- Conversational and personal
- Empathetic and helpful
- Can use emojis sparingly

### Technical Style
- Detailed and solution-focused
- Specific technical information
- Problem-solving oriented
- Professional but informative

## Language Support

The system automatically generates responses in:
- **English (en)** - Default language
- **Ukrainian (uk)** - Full Ukrainian language support

## Usage

1. Navigate to **Mentions** page
2. Click on any mention to view details
3. Click **"Generate Response"** button
4. The system will:
   - Pre-fill the mention content
   - Auto-select appropriate style based on sentiment
   - Add context information (platform, author, intent, topics)
5. Adjust settings if needed and click **"Generate Response"**
6. Review and customize the AI-generated response
7. Copy or send the response

## Security Notes

⚠️ **Important**: 
- Never commit your `.env` file to version control
- The `.env` file is already listed in `.gitignore`
- In production, API calls should be made from a secure backend server
- The current implementation uses `dangerouslyAllowBrowser: true` for development only

## Troubleshooting

### Error: "Failed to generate response. Please check your OpenAI API key."

**Possible causes:**
1. API key is not set or incorrect
2. API key doesn't have sufficient credits
3. Network connectivity issues
4. Rate limit exceeded

**Solutions:**
1. Verify your API key is correctly set in `.env`
2. Check your OpenAI account billing and credits
3. Ensure you have internet connectivity
4. Wait a moment and try again if rate limited

### Environment variables not loading

If your environment variables aren't loading:
1. Ensure the file is named exactly `.env` (not `.env.txt`)
2. Restart your development server
3. Check that variables start with `VITE_` prefix (required by Vite)

## Cost Information

- The application uses **GPT-4o-mini** model for cost efficiency
- Each response generation costs approximately $0.0001-0.0003
- Consider setting up usage limits in your OpenAI account

## API Models

Currently using: **gpt-4o-mini**
- Fast response times
- Cost-effective
- High-quality outputs
- Suitable for customer service responses

You can modify the model in `src/services/responses.ts` if needed.

