import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SendTestDto {
  @IsEmail()
  to!: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @MinLength(1)
  html!: string;
}
