import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'refresh-token-exemplo',
    description: 'Refresh token opaco emitido no login',
  })
  @IsString()
  refreshToken!: string;
}
