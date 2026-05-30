import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiSuggestionsService } from './ai-suggestions.service';
import { AiSuggestionsRateLimitGuard } from './ai-suggestions-rate-limit.guard';

@Module({
  controllers: [AiController],
  providers: [AiSuggestionsService, AiSuggestionsRateLimitGuard],
})
export class AiModule {}
