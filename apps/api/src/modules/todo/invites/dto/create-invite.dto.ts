import { TodoInviteRole } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateTodoInviteDto {
  @IsEnum(TodoInviteRole)
  @IsOptional()
  role?: TodoInviteRole = TodoInviteRole.EDITOR;

  @IsInt()
  @Min(1)
  @Max(365)
  @IsOptional()
  expiresInDays?: number = 30;

  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  maxUses?: number = 50;
}

