import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateTodoItemDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}
