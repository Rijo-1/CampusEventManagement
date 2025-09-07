import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface EventAnalytics {
  registrations: number;
  attendance: number;
  avgRating: number;
  feedback: string[];
  demographics: {
    departments: Record<string, number>;
    years: Record<string, number>;
  };
}

export async function generateEventReport(
  eventTitle: string,
  analytics: EventAnalytics
): Promise<string> {
  try {
    const prompt = `
Generate a comprehensive, personalized AI report for the event "${eventTitle}" based on the following analytics:

Event Analytics:
- Total Registrations: ${analytics.registrations}
- Actual Attendance: ${analytics.attendance}
- Attendance Rate: ${((analytics.attendance / analytics.registrations) * 100).toFixed(1)}%
- Average Rating: ${analytics.avgRating}/5
- Department Distribution: ${JSON.stringify(analytics.demographics.departments)}
- Year Distribution: ${JSON.stringify(analytics.demographics.years)}
- Sample Feedback: ${analytics.feedback.slice(0, 3).join('; ')}

Please provide:
1. Executive Summary (2-3 sentences)
2. Key Performance Insights
3. Audience Analysis
4. Recommendations for Future Events
5. Success Metrics Breakdown

Keep the tone professional but engaging, suitable for college event organizers. Focus on actionable insights and data-driven recommendations.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert event analytics consultant specializing in college campus events. Provide detailed, actionable insights based on event data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0]?.message?.content || 'Unable to generate report at this time.';
  } catch (error) {
    console.error('Error generating AI report:', error);
    return 'Unable to generate AI report. Please check your Groq API configuration.';
  }
}

export async function generateStudentInsights(
  studentName: string,
  eventsAttended: number,
  favoriteEventTypes: string[],
  totalPoints: number
): Promise<string> {
  try {
    const prompt = `
Generate personalized insights for student "${studentName}" based on their campus event participation:

Student Profile:
- Events Attended: ${eventsAttended}
- Favorite Event Types: ${favoriteEventTypes.join(', ')}
- Total Points Earned: ${totalPoints}

Provide:
1. Participation Summary
2. Engagement Patterns
3. Recommended Events
4. Achievement Recognition
5. Growth Opportunities

Keep it encouraging and personalized, highlighting their contributions to campus life.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a campus engagement advisor who helps students maximize their college experience through event participation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.8,
      max_tokens: 800
    });

    return completion.choices[0]?.message?.content || 'Unable to generate insights at this time.';
  } catch (error) {
    console.error('Error generating student insights:', error);
    return 'Unable to generate student insights. Please check your Groq API configuration.';
  }
}