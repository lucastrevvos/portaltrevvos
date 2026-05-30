import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsLocale,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export type AiSuggestionListType = 'task' | 'shopping' | 'routine';

export class ListItemSuggestionsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsIn(['task', 'shopping', 'routine'])
  type!: AiSuggestionListType;

  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(120, { each: true })
  existingItems!: string[];

  @IsString()
  @IsLocale()
  locale!: string;
}
