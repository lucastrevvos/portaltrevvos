import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTodoItemDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsBoolean()
  @IsOptional()
  isDone?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}
