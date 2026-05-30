import { HttpException, HttpStatus } from '@nestjs/common';
import { AiSuggestionsRateLimitGuard } from './ai-suggestions-rate-limit.guard';

describe('AiSuggestionsRateLimitGuard', () => {
  it('allows up to three requests per minute per ip', () => {
    const guard = new AiSuggestionsRateLimitGuard();
    const request = {
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(guard.canActivate(context)).toBe(true);
    expect(guard.canActivate(context)).toBe(true);
    expect(guard.canActivate(context)).toBe(true);
    try {
      guard.canActivate(context);
      fail('Expected the fourth call to be rate limited');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  });
});
