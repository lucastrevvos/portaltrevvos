import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiSuggestionsService } from './ai-suggestions.service';
import { AiSuggestionsRateLimitGuard } from './ai-suggestions-rate-limit.guard';
import { ListItemSuggestionsDto } from './dto/list-item-suggestions.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly suggestionsService: AiSuggestionsService) {}

  @UseGuards(AiSuggestionsRateLimitGuard)
  @Post('suggestions/list-items')
  suggestListItems(@Body() dto: ListItemSuggestionsDto) {
    return this.suggestionsService.suggestListItems(dto);
  }
}
