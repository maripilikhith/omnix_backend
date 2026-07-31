import { BaseService } from '../../shared/base.service.js';
import { gameRepository } from './game.repository.js';
import { NotFoundError, ConflictError } from '../../utils/ApiError.js';
import { ERROR_CODES } from '../../constants/index.js';

// In-memory cache for generated TTS MP3 audio to prevent billing duplicates
const ttsCache = new Map();

/**
 * Game business logic layer.
 */
export class GameService extends BaseService {
  constructor() {
    super(gameRepository);
  }

  /**
   * Get all published games for a specific course + module.
   * Used by the frontend to dynamically discover available games.
   */
  async getGamesForModule(courseSlug, moduleNumber, topicSlug = null) {
    return this.repository.findByCourseAndModule(courseSlug, moduleNumber, topicSlug);
  }

  /**
   * Get all published games for a course (across all modules).
   */
  async getGamesForCourse(courseSlug) {
    return this.repository.findByCourse(courseSlug);
  }

  /**
   * Get all published games across all courses.
   */
  async getAllPublishedGames() {
    return this.repository.findAllPublishedUnpaginated();
  }

  /**
   * Get a game's metadata only (no htmlContent).
   */
  async getGameMeta(gameId) {
    const game = await this.repository.findByGameIdMeta(gameId);
    if (!game) {
      throw new NotFoundError('Game', ERROR_CODES.GAME_NOT_FOUND);
    }
    return game;
  }

  /**
   * Get the full HTML content for a game (for iframe rendering).
   */
  async getGameHtml(gameId) {
    const game = await this.repository.findByGameId(gameId);
    if (!game) {
      throw new NotFoundError('Game', ERROR_CODES.GAME_NOT_FOUND);
    }
    return game.htmlContent;
  }

  /**
   * Create a new game with metadata + htmlContent.
   */
  async createGame(data) {
    // Check for duplicate gameId
    const exists = await this.repository.existsByGameId(data.gameId);
    if (exists) {
      throw new ConflictError(
        `Game with gameId "${data.gameId}" already exists`,
        ERROR_CODES.GAME_ALREADY_EXISTS,
      );
    }
    return this.repository.create(data);
  }

  /**
   * Update a game by its MongoDB _id.
   */
  async updateGame(id, data) {
    if (data.htmlContent !== undefined && (!data.htmlContent || !data.htmlContent.trim())) {
      delete data.htmlContent;
    }
    return this.repository.updateById(id, data);
  }

  /**
   * Delete a game by its MongoDB _id.
   */
  async deleteGame(id) {
    return this.repository.deleteById(id);
  }

  /**
   * Delete a game by its gameId.
   */
  async deleteGameByGameId(gameId) {
    const doc = await this.repository.deleteByGameId(gameId);
    if (!doc) {
      throw new NotFoundError('Game', ERROR_CODES.GAME_NOT_FOUND);
    }
    return doc;
  }

  /**
   * Get all games (admin — includes unpublished).
   */
  async getAllGamesAdmin(queryParams) {
    return this.repository.findAllAdmin(queryParams);
  }

  /**
   * Get all games unpaginated (admin legacy compat).
   */
  async getAllGamesAdminUnpaginated() {
    return this.repository.findAllAdminUnpaginated();
  }

  /**
   * Toggle publish status.
   */
  async togglePublish(id) {
    const game = await this.repository.findById(id, { select: '-htmlContent' });
    game.isPublished = !game.isPublished;
    await game.save();
    return game;
  }

  /**
   * Generate MP3 audio buffer from Azure Cognitive Services TTS REST API.
   * Caches results in memory to avoid billing duplicates.
   */
  async generateSpeech(text, voiceId = null) {
    const azureKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION || 'eastus';
    const voice = voiceId || process.env.AZURE_SPEECH_VOICE_ID || 'en-US-NovaTurboMultilingualNeural';

    if (!azureKey) {
      throw new Error('AZURE_SPEECH_KEY is not configured on the server');
    }

    const cacheKey = `${voice}:${text}`;
    if (ttsCache.has(cacheKey)) {
      return ttsCache.get(cacheKey);
    }

    const safeXml = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const ssml = `<speak version='1.0' xml:lang='en-US'><voice name='${voice}'>${safeXml}</voice></speak>`;

    const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: ssml,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Azure TTS request failed (${response.status}): ${errText}`);
    }

    const arrayBuf = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    // LRU eviction for simple 200 item limit
    if (ttsCache.size > 200) {
      const firstKey = ttsCache.keys().next().value;
      ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, buffer);

    return buffer;
  }

  /**
   * Issue a short-lived (10-minute) authorization token for Azure Speech SDK streaming.
   */
  async issueSpeechToken() {
    const azureKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION || 'eastus';

    if (!azureKey) {
      throw new Error('AZURE_SPEECH_KEY is not configured on the server');
    }

    const response = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureKey,
        'Content-Length': '0',
      },
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Azure STS Token exchange failed (${response.status}): ${errText}`);
    }

    const token = await response.text();
    const voiceId = process.env.AZURE_SPEECH_VOICE_ID || 'en-US-NovaTurboMultilingualNeural';
    return { token, region, voiceId };
  }
}

// Singleton instance
export const gameService = new GameService();
