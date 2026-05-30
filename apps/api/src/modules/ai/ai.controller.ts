import { Body, Controller, Post } from '@nestjs/common';
import { AiSuggestionsService } from './ai-suggestions.service';
import { ListItemSuggestionsDto } from './dto/list-item-suggestions.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly suggestionsService: AiSuggestionsService) {}

  @Post('suggestions/list-items')
  suggestListItems(@Body() dto: ListItemSuggestionsDto) {
    return this.suggestionsService.suggestListItems(dto);
  }
}
