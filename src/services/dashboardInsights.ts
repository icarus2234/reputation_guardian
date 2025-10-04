import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@/utils/constants';
import { DashboardData } from '@/types/analytics';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from backend
});

interface DashboardInsight {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  urgentActions: string[];
}

const buildDashboardPrompt = (dashboardData: DashboardData): string => {
  const {
    reputation_score,
    sentiment_distribution,
    top_issues_requiring_attention,
    platform_distribution,
    recent_activity,
  } = dashboardData;

  // Debug logging
  console.log('Dashboard data structure:', {
    reputation_score: !!reputation_score,
    sentiment_distribution: !!sentiment_distribution,
    top_issues_requiring_attention: !!top_issues_requiring_attention,
    platform_distribution: !!platform_distribution,
    platform_distribution_platforms: !!platform_distribution?.platforms,
    recent_activity: !!recent_activity,
  });

  return `You are a brand reputation analyst AI. Analyze the following brand reputation data and provide actionable insights.

REPUTATION SCORE:
- Current Score: ${reputation_score?.current_score?.toFixed(1) || '0.0'}/100
- Previous Score: ${reputation_score?.previous_score?.toFixed(1) || '0.0'}/100
- Change: ${reputation_score?.percentage_change ? (reputation_score.percentage_change > 0 ? '+' : '') + reputation_score.percentage_change.toFixed(1) : '0.0'}%
- Status: ${reputation_score?.score_interpretation?.status || 'Unknown'}
- Interpretation: ${reputation_score?.score_interpretation?.description || 'No interpretation available'}

SENTIMENT DISTRIBUTION (Total: ${sentiment_distribution?.total_mentions || 0} mentions):
- Positive: ${sentiment_distribution?.counts?.positive || 0} (${sentiment_distribution?.percentages?.positive?.toFixed(1) || '0.0'}%)
- Negative: ${sentiment_distribution?.counts?.negative || 0} (${sentiment_distribution?.percentages?.negative?.toFixed(1) || '0.0'}%)
- Neutral: ${sentiment_distribution?.counts?.neutral || 0} (${sentiment_distribution?.percentages?.neutral?.toFixed(1) || '0.0'}%)
- Dominant Sentiment: ${sentiment_distribution?.dominant_sentiment || 'Unknown'}

TOP ISSUES REQUIRING ATTENTION:
${
  top_issues_requiring_attention
    ?.slice(0, 5)
    .map(
      (issue, i) =>
        `${i + 1}. ${issue.title} (${issue.priority} priority, ${issue.total_mentions} mentions)`
    )
    .join('\n') || 'No issues data available'
}

PLATFORM DISTRIBUTION:
${
  platform_distribution?.platforms
    ?.slice(0, 5)
    .map(
      (p) =>
        `- ${p.platform}: ${p.count} mentions (${p.percentage.toFixed(1)}%)`
    )
    .join('\n') || 'No platform data available'
}

RECENT ACTIVITY (Last ${dashboardData?.dashboard_data?.time_period_days || 30} days):
- Total Mentions: ${dashboardData?.dashboard_data?.total_mentions || 0}
- Recent Mentions: ${recent_activity?.total_recent_mentions || 0}
- Most Active Platform: ${recent_activity?.most_active_platform || 'Unknown'}
- Critical Issues: ${recent_activity?.critical_issues_count || 0}

TASK:
Based on this data, provide:

1. **Executive Summary** (2-3 sentences): A brief overview of the brand's current reputation health.

2. **Key Findings** (3-5 bullet points): The most important insights from the data.

3. **Strategic Recommendations** (4-6 actionable items): Specific actions the brand should take to improve reputation, prioritized by impact.

4. **Urgent Actions** (2-3 items): Critical issues that need immediate attention.

Format your response as a JSON object with the following structure:
{
  "summary": "executive summary text",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "urgentActions": ["action 1", "action 2"]
}

Be specific, actionable, and data-driven. Focus on what the brand should DO, not just what the data shows.`;
};

export const generateDashboardInsights = async (
  dashboardData: DashboardData
): Promise<DashboardInsight> => {
  try {
    const prompt = buildDashboardPrompt(dashboardData);

    console.log('Generating dashboard insights with OpenAI...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a brand reputation analyst AI that provides clear, actionable insights based on data. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content || '{}';
    const insight = JSON.parse(responseText) as DashboardInsight;

    console.log('Dashboard insights generated successfully');

    return insight;
  } catch (error) {
    console.error('Error generating dashboard insights:', error);
    throw new Error('Failed to generate insights. Please try again.');
  }
};
