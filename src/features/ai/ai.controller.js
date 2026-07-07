import { catchAsync } from '../../utils/catchAsync.js';

const LOCAL_MICROSERVICE_BASE = 'http://127.0.0.1:8000';

/**
 * Tries the primary URL first.
 * If it throws (network error / Render down), automatically retries on local fallback.
 */
async function callWithFallback(primaryUrl, fallbackUrl, options) {
  try {
    const response = await fetch(primaryUrl, options);
    // If we get a server error from Render (5xx), try local fallback too
    if (!response.ok && response.status >= 500) {
      console.warn(`[AI] Primary (${primaryUrl}) returned ${response.status}. Trying local fallback...`);
      return await fetch(fallbackUrl, options);
    }
    return response;
  } catch (err) {
    console.warn(`[AI] Primary (${primaryUrl}) unreachable: ${err.message}. Falling back to local...`);
    return await fetch(fallbackUrl, options);
  }
}

export const aiController = {
  queryResolver: catchAsync(async (req, res) => {
    const { context, question, screenshot } = req.body;

    const primaryUrl  = process.env.AI_MICROSERVICE_URL || 'https://interactive-video-hdxc.onrender.com/api/query-resolver/';
    const fallbackUrl = `${LOCAL_MICROSERVICE_BASE}/api/query-resolver/`;
    const secretToken = process.env.API_SECRET_TOKEN || 'Secret';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretToken}`
      },
      body: JSON.stringify({ context, question, screenshot })
    };

    const response = await callWithFallback(primaryUrl, fallbackUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Microservice Error:', response.status, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return res.status(response.status).json({ error: errorJson.error || 'Failed to communicate with AI microservice' });
      } catch (e) {
        return res.status(response.status).json({ error: errorText || 'Failed to communicate with AI microservice' });
      }
    }

    const data = await response.json();
    return res.json(data);
  }),

  evaluateAnswer: catchAsync(async (req, res) => {
    const { question, userAnswer, rightAnswer } = req.body;

    const primaryUrl  = process.env.AI_QNA_URL || 'https://interactive-video-hdxc.onrender.com/api/qna/';
    const fallbackUrl = `${LOCAL_MICROSERVICE_BASE}/api/qna/`;
    const secretToken = process.env.API_SECRET_TOKEN || 'Secret';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretToken}`
      },
      body: JSON.stringify({
        "Question": question,
        "answer from user": userAnswer,
        "Right answer": rightAnswer
      })
    };

    const response = await callWithFallback(primaryUrl, fallbackUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI QnA Microservice Error:', response.status, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return res.status(response.status).json({ error: errorJson.error || 'Failed to evaluate answer' });
      } catch (e) {
        return res.status(response.status).json({ error: errorText || 'Failed to evaluate answer' });
      }
    }

    const data = await response.json();
    return res.json(data);
  })
};

