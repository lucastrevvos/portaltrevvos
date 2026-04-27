import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT de acesso',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'refresh-token-exemplo',
    description: 'Refresh token opaco',
  })
  refreshToken!: string;
}
