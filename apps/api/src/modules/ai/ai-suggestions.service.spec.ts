import {
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AiSuggestionsService } from './ai-suggestions.service';
import { ListItemSuggestionsDto } from './dto/list-item-suggestions.dto';

describe('AiSuggestionsService', () => {
  const originalEnv = {
    AI_SUGGESTIONS_ENABLED: process.env.AI_SUGGESTIONS_ENABLED,
    AI_PROVIDER: process.env.AI_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AI_SUGGESTIONS_MODEL: process.env.AI_SUGGESTIONS_MODEL,
  };
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.AI_SUGGESTIONS_ENABLED = 'true';
    process.env.AI_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.AI_SUGGESTIONS_MODEL = 'test-model';
  });

  afterEach(() => {
    process.env.AI_SUGGESTIONS_ENABLED = originalEnv.AI_SUGGESTIONS_ENABLED;
    process.env.AI_PROVIDER = originalEnv.AI_PROVIDER;
    process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY;
    process.env.AI_SUGGESTIONS_MODEL = originalEnv.AI_SUGGESTIONS_MODEL;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('sanitizes, deduplicates and caps suggestions', async () => {
    const service = new AiSuggestionsService();
    const dto: ListItemSuggestionsDto = {
      title: 'Compras da semana',
      type: 'shopping',
      existingItems: ['Arroz'],
      locale: 'pt-BR',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: `\`\`\`json
{"suggestions":["Arroz","","Feijao","feijao","Ovos","Leite","Pao","Tomate","Banana"]}
\`\`\``,
              },
            },
          ],
        }),
    }) as typeof fetch;

    await expect(service.suggestListItems(dto)).resolves.toEqual({
      suggestions: ['Feijao', 'Ovos', 'Leite', 'Pao', 'Tomate', 'Banana'],
    });
  });

  it('returns a safe error when ai is not configured', async () => {
    delete process.env.AI_SUGGESTIONS_ENABLED;
    delete process.env.OPENAI_API_KEY;

    const service = new AiSuggestionsService();

    await expect(
      service.suggestListItems({
        title: 'Lista',
        type: 'task',
        existingItems: [],
        locale: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('maps provider errors to a safe bad gateway response', async () => {
    const service = new AiSuggestionsService();

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as typeof fetch;

    await expect(
      service.suggestListItems({
        title: 'Lista',
        type: 'routine',
        existingItems: [],
        locale: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
});
