import { getAIProvider } from '../../services/ai/index.js';
import { PromptService } from '../../services/ai/prompt.service.js';
import { VideoQuestionModel } from './videoQuestion.model.js';

export class VideoQuestionService {
  constructor() {
    this.ai = getAIProvider();
    this.promptService = new PromptService();
  }

  /**
   * Configure/setup an interactive video pause question.
   * Replicates Python setup_question route.
   */
  async setupQuestion(data) {
    const pause_time = data['Pause Time'] ?? data.pause_time ?? data.pauseTime ?? '';
    const right_answer = data['Right answer'] ?? data.right_answer ?? data.rightAnswer ?? '';
    const wrong_answer = data['Wrong answer'] ?? data.wrong_answer ?? data.wrongAnswer ?? '';

    return {
      message: 'Question configured successfully.',
      configured_data: {
        pause_time,
        right_answer,
        wrong_answer,
      },
    };
  }

  /**
   * Evaluate a student's answer to a video question.
   * Replicates Python qna route.
   */
  async evaluateAnswer(data) {
    const prompt_template = data.Prompt || data.promptTemplate || '';
    const question = data.Question || data.question || '';
    const answer_from_user =
      data['answer from user'] || data.answer_from_user || data.userAnswer || data.studentAnswer || '';
    const right_answer =
      data['Right answer'] || data.right_answer || data.rightAnswer || data.correctAnswer || '';

    let finalPrompt;
    if (prompt_template) {
      finalPrompt = prompt_template
        .replace('{Question}', question)
        .replace('{answer from user}', answer_from_user)
        .replace('{Right answer}', right_answer);
    } else {
      finalPrompt = `An eager-to-learn student was asked the following question: '${question}'.
The objectively correct answer is: '${right_answer}'.
The student answered: '${answer_from_user}'.
Evaluate the student's answer. If it is correct, praise them encouragingly. If it is incorrect or partially correct, gently correct them, provide the right answer, and explain why so they can learn from it.
Keep your explanation concise and directly to the point. Do not over-explain.

Respond with a JSON object:
{
  "output": "A clear string containing encouraging and constructive feedback explaining whether the student's answer is correct and why."
}`;
    }

    try {
      const parsedJson = await this.ai.generateJSON(finalPrompt, null, {
        temperature: 0.2,
      });

      let outputText = 'Answer evaluated.';
      if (typeof parsedJson.output === 'string') {
        outputText = parsedJson.output;
      } else if (typeof parsedJson.feedback === 'string') {
        outputText = parsedJson.feedback;
      } else if (typeof parsedJson.output === 'object' && parsedJson.output !== null) {
        outputText =
          parsedJson.output.feedback ||
          parsedJson.output.message ||
          parsedJson.output.text ||
          parsedJson.output.output ||
          JSON.stringify(parsedJson.output);
      } else if (typeof parsedJson.feedback === 'object' && parsedJson.feedback !== null) {
        outputText =
          parsedJson.feedback.text ||
          parsedJson.feedback.message ||
          JSON.stringify(parsedJson.feedback);
      } else if (typeof parsedJson === 'string') {
        outputText = parsedJson;
      }

      const strOutput = String(outputText || 'Answer evaluated.');
      return {
        output: strOutput,
        isCorrect: Boolean(parsedJson.isCorrect ?? false),
        score: Number(parsedJson.score ?? 0),
        feedback: strOutput,
        explanation: String(parsedJson.explanation || ''),
      };
    } catch (err) {
      // If AI fails to return clean JSON, fall back to text generation
      const text = await this.ai.generateText(finalPrompt, { temperature: 0.2 });
      return {
        output: String(text).trim(),
      };
    }
  }

  async listByStory(storyId) {
    return VideoQuestionModel.find({ storyId }).sort({ timestampSeconds: 1 }).lean();
  }

  async create(questionData) {
    return VideoQuestionModel.create(questionData);
  }
}

export const videoQuestionService = new VideoQuestionService();
