import OpenAI from 'openai';
import apiClient from './api';
import {
  GeneratedResponse,
  ResponseRequest,
  ResponseHistory,
} from '@/types/response';
import { OPENAI_API_KEY } from '@/utils/constants';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from backend
});

const detectSentiment = (
  content: string
): 'negative' | 'positive' | 'neutral' => {
  const negativeKeywords = [
    'terrible',
    'awful',
    'horrible',
    'disappointed',
    'disgusting',
    'hate',
    'worst',
    'poor',
    'bad',
    'sucks',
    'pathetic',
    'useless',
    'waste',
    'ripoff',
    'scam',
    'angry',
    'frustrated',
    'annoyed',
    'upset',
    'furious',
    'outraged',
    'disgusted',
    'never again',
    'avoid',
    'stay away',
    'beware',
    'warning',
    'complaint',
    'broken',
    'defective',
    'faulty',
    'malfunction',
    'error',
    'bug',
    'glitch',
    'slow',
    'late',
    'delayed',
    'incompetent',
    'unprofessional',
    'rude',
    'ignorant',
  ];

  const positiveKeywords = [
    'excellent',
    'amazing',
    'wonderful',
    'fantastic',
    'great',
    'love',
    'perfect',
    'outstanding',
    'brilliant',
    'superb',
    'exceptional',
    'marvelous',
    'delightful',
    'happy',
    'satisfied',
    'pleased',
    'impressed',
    'recommend',
    'best',
    'awesome',
    'quick',
    'fast',
    'efficient',
    'professional',
    'helpful',
    'friendly',
    'kind',
  ];

  const lowerContent = content.toLowerCase();
  const negativeCount = negativeKeywords.filter((word) =>
    lowerContent.includes(word)
  ).length;
  const positiveCount = positiveKeywords.filter((word) =>
    lowerContent.includes(word)
  ).length;

  if (negativeCount > positiveCount && negativeCount > 0) return 'negative';
  if (positiveCount > negativeCount && positiveCount > 0) return 'positive';
  return 'neutral';
};

const buildPrompt = (request: ResponseRequest): string => {
  const sentiment = detectSentiment(request.mention_content);

  const styleGuides = {
    official: {
      en: 'Use a formal, professional tone. Be respectful, authoritative, and corporate. Avoid casual language and emojis.',
      uk: 'Використовуйте формальний, професійний тон. Будьте ввічливими, авторитетними та корпоративними. Уникайте розмовної мови та емодзі.',
    },
    friendly: {
      en: 'Use a warm, approachable, and conversational tone. Be empathetic, personal, and helpful. You can use emojis sparingly.',
      uk: 'Використовуйте теплий, доступний та розмовний тон. Будьте емпатійними, особистими та корисними. Можете помірно використовувати емодзі.',
    },
    technical: {
      en: 'Use a detailed, solution-focused, and technical tone. Be specific, provide technical details, and focus on problem-solving. Avoid casual language.',
      uk: 'Використовуйте детальний, орієнтований на рішення та технічний тон. Будьте конкретними, надавайте технічні деталі та зосередьтеся на вирішенні проблем.',
    },
  };

  const languageInstruction =
    request.language === 'uk'
      ? 'IMPORTANT: Respond ONLY in Ukrainian language.'
      : 'IMPORTANT: Respond ONLY in English language.';

  const styleGuide = styleGuides[request.style][request.language];

  // Extract potential reviewer name from mention content
  const nameMatch = request.mention_content.match(
    /(?:by|from|review by|posted by)\s+([A-Za-z]+)/i
  );
  const reviewerName = nameMatch ? nameMatch[1] : null;

  let prompt = `You are a professional customer service representative for a brand reputation management system specializing in handling negative reviews.

${languageInstruction}

DETECTED SENTIMENT: ${sentiment.toUpperCase()}
STYLE: ${request.style}
${styleGuide}

Customer Mention:
"${request.mention_content}"
`;

  if (reviewerName) {
    prompt += `\n\nREVIEWER NAME: ${reviewerName}`;
  }

  if (request.custom_instructions) {
    prompt += `\n\nAdditional Context:\n${request.custom_instructions}\n`;
  }

  if (sentiment === 'negative') {
    prompt += `\n\nCRITICAL NEGATIVE REVIEW RESPONSE GUIDELINES:
You MUST follow these 11 essential steps for negative review responses:

1. ADDRESS THE REVIEWER: ${reviewerName ? `Use the reviewer's name "${reviewerName}"` : 'Use a personalized greeting (avoid generic "dear customer")'}

2. APOLOGIZE SINCERELY: Start with a heartfelt, genuine apology. Even if it wasn't your fault, show you care about their experience.

3. TAKE RESPONSIBILITY: Acknowledge your business's role without blaming the customer. Be humble and professional.

4. PROVIDE EXPLANATION: Explain what went wrong without making excuses. Show you understand the root cause.

5. THANK THE REVIEWER: Thank them for taking time to provide feedback and helping you improve.

6. OFFER TO MAKE IT RIGHT: Show specific steps you'll take to resolve their issue and prevent it from happening again.

7. PROVIDE ALTERNATIVE CONTACT: Offer a direct way to contact you (phone/email) for further discussion.

8. RESPOND QUICKLY: Acknowledge this is a priority response.

9. DON'T TAKE IT PERSONALLY: Maintain professional, objective tone even if the review is harsh.

10. OFFER REFUND/DISCOUNT: Consider offering appropriate compensation if warranted.

11. ASK FOR SECOND CHANCE: Invite them back to give you another opportunity to serve them better.

RESPONSE REQUIREMENTS:
- Length: 4-6 sentences for negative reviews (more detailed than positive)
- Tone: Empathetic, professional, solution-focused
- Include: Personalization, apology, explanation, solution, contact info, second chance offer
- Avoid: Defensive language, excuses, generic responses, taking it personally

RESPONSE:`;
  } else {
    prompt += `\n\nPlease provide:
1. A well-crafted response that addresses the customer's concern
2. Be empathetic and solution-oriented
3. Keep the response concise (2-4 sentences for friendly style, 3-5 for others)
4. Make it sound natural and human

RESPONSE:`;
  }

  return prompt;
};

export const generateResponse = async (
  request: ResponseRequest
): Promise<GeneratedResponse> => {
  try {
    const sentiment = detectSentiment(request.mention_content);
    const prompt = buildPrompt(request);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional customer service expert specializing in brand reputation management and negative review recovery. You excel at turning unhappy customers into loyal advocates through empathetic, solution-focused responses. You follow proven best practices for addressing customer complaints and always maintain a professional, humble, and caring tone.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';

    // Generate contextual action checklist based on the mention
    const actionChecklist = generateActionChecklist(request);

    return {
      id: `response-${Date.now()}`,
      mention_id: request.mention_id,
      style: request.style,
      language: request.language,
      content,
      action_checklist: actionChecklist,
      faq_links:
        sentiment === 'negative'
          ? [
              {
                title: 'Negative Review Response Guidelines',
                url: '/support/negative-reviews',
                relevance_score: 0.95,
              },
              {
                title: 'Customer Satisfaction Recovery',
                url: '/support/recovery',
                relevance_score: 0.88,
              },
              {
                title: 'Direct Customer Support',
                url: '/support/contact',
                relevance_score: 0.85,
              },
            ]
          : [
              {
                title: 'Customer Support Guidelines',
                url: '/support/guidelines',
                relevance_score: 0.85,
              },
              {
                title: 'Contact Support Team',
                url: '/support/contact',
                relevance_score: 0.72,
              },
            ],
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating response with OpenAI:', error);
    throw new Error(
      'Failed to generate response. Please check your OpenAI API key.'
    );
  }
};

const generateActionChecklist = (request: ResponseRequest): string[] => {
  const sentiment = detectSentiment(request.mention_content);

  const baseActions = [
    'Review customer history and previous interactions',
    'Document the issue in customer support system',
  ];

  if (sentiment === 'negative') {
    baseActions.push(
      'Escalate to senior support team immediately',
      'Follow up within 24 hours via phone/email',
      'Offer appropriate compensation (refund/discount)',
      'Implement process improvements to prevent recurrence',
      'Monitor for follow-up response from customer',
      'Update customer service training based on feedback'
    );
  } else if (sentiment === 'positive') {
    baseActions.push(
      'Thank customer publicly and privately',
      'Share positive feedback with team',
      'Consider featuring in testimonials',
      'Monitor for follow-up questions'
    );
  } else {
    baseActions.push(
      'Monitor for follow-up questions',
      'Provide additional resources if needed'
    );
  }

  // Add context-specific actions based on custom instructions
  if (request.custom_instructions?.toLowerCase().includes('complaint')) {
    baseActions.push('Schedule follow-up call', 'Prepare compensation offer');
  } else if (request.custom_instructions?.toLowerCase().includes('question')) {
    baseActions.push(
      'Provide detailed documentation links',
      'Offer live chat support if needed'
    );
  }

  return baseActions;
};

export const getResponseHistory = async (
  mentionId: string
): Promise<ResponseHistory[]> => {
  return apiClient.get(`/api/responses/history/${mentionId}`);
};

export const sendResponse = async (
  responseId: string,
  content: string
): Promise<ResponseHistory> => {
  return apiClient.post('/api/responses/send', {
    response_id: responseId,
    content,
  });
};
