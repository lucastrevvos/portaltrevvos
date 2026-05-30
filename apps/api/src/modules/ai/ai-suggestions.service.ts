import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  AiSuggestionListType,
  ListItemSuggestionsDto,
} from './dto/list-item-suggestions.dto';

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

type SuggestionPayload = {
  suggestions?: unknown;
};

const MAX_SUGGESTIONS = 7;
const MIN_SUGGESTIONS = 3;

@Injectable()
export class AiSuggestionsService {
  private readonly logger = new Logger(AiSuggestionsService.name);

  async suggestListItems(
    dto: ListItemSuggestionsDto,
  ): Promise<{ suggestions: string[] }> {
    this.ensureConfigured();

    const existingItems = this.normalizeItems(dto.existingItems).slice(0, 50);
    const content = await this.requestOpenAiSuggestions({
      title: dto.title.trim(),
      type: dto.type,
      existingItems,
      locale: dto.locale,
    });

    const suggestions = this.sanitizeSuggestions(content, existingItems);

    if (suggestions.length < MIN_SUGGESTIONS) {
      throw new BadGatewayException('Could not generate AI suggestions');
    }

    return { suggestions };
  }

  private ensureConfigured() {
    if (
      process.env.AI_SUGGESTIONS_ENABLED !== 'true' ||
      process.env.AI_PROVIDER !== 'openai' ||
      !process.env.OPENAI_API_KEY
    ) {
      throw new ServiceUnavailableException(
        'AI suggestions are not configured',
      );
    }
  }

  private async requestOpenAiSuggestions(input: {
    title: string;
    type: AiSuggestionListType;
    existingItems: string[];
    locale: string;
  }): Promise<string> {
    const model = process.env.AI_SUGGESTIONS_MODEL || 'gpt-4o-mini';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model,
            temperature: 0.4,
            max_tokens: 220,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content:
                  'Voce sugere itens curtos e praticos para listas. Responda sempre em portugues brasileiro. Retorne somente JSON valido no formato {"suggestions":["item"]}. Gere de 3 a 7 sugestoes, sem repetir itens existentes e sem texto explicativo.',
              },
              {
                role: 'user',
                content: JSON.stringify({
                  title: input.title,
                  type: input.type,
                  existingItems: input.existingItems,
                  locale: input.locale,
                  typeRules: {
                    task: 'tarefas praticas',
                    shopping: 'itens de compra',
                    routine: 'passos ou habitos de rotina',
                  },
                }),
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        this.logger.warn(
          `OpenAI suggestions request failed: ${response.status}`,
        );
        throw new BadGatewayException('Could not generate AI suggestions');
      }

      const data = (await response.json()) as OpenAiChatResponse;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new BadGatewayException('Could not generate AI suggestions');
      }

      return content;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.warn('OpenAI suggestions request failed');
      throw new BadGatewayException('Could not generate AI suggestions');
    } finally {
      clearTimeout(timeout);
    }
  }

  private sanitizeSuggestions(content: string, existingItems: string[]) {
    const parsed = this.parseSuggestions(content);
    const existing = new Set(
      existingItems.map((item) => this.toDedupKey(item)),
    );
    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of parsed) {
      const suggestion = this.cleanSuggestion(value);
      const key = this.toDedupKey(suggestion);

      if (!suggestion || existing.has(key) || seen.has(key)) {
        continue;
      }

      seen.add(key);
      result.push(suggestion);

      if (result.length >= MAX_SUGGESTIONS) {
        break;
      }
    }

    return result;
  }

  private parseSuggestions(content: string): unknown[] {
    try {
      const parsed = JSON.parse(content) as SuggestionPayload | unknown[];

      if (Array.isArray(parsed)) {
        return parsed;
      }

      if (
        this.isSuggestionPayload(parsed) &&
        Array.isArray(parsed.suggestions)
      ) {
        return parsed.suggestions;
      }
    } catch {
      return content.split('\n');
    }

    return [];
  }

  private isSuggestionPayload(value: unknown): value is SuggestionPayload {
    return (
      typeof value === 'object' && value !== null && 'suggestions' in value
    );
  }

  private normalizeItems(items: string[]) {
    return items.map((item) => item.trim()).filter(Boolean);
  }

  private cleanSuggestion(value: unknown) {
    if (typeof value !== 'string') {
      return '';
    }

    return value
      .replace(/^\s*[-*\d.)]+\s*/u, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);
  }

  private toDedupKey(value: string) {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase('pt-BR')
      .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
      .trim();
  }
}
