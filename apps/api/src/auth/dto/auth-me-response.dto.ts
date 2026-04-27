import { ApiProperty } from '@nestjs/swagger';

class AuthMeAppDto {
  @ApiProperty({ example: 'portal' })
  slug!: string;

  @ApiProperty({ example: 'Portal Trevvos' })
  name!: string;

  @ApiProperty({ example: 'EDITOR' })
  role!: string;
}

export class AuthMeResponseDto {
  @ApiProperty({ example: 'clx123abc456def789' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Lucas', nullable: true, required: false })
  name?: string | null;

  @ApiProperty({ example: 'USER' })
  globalRole!: string;

  @ApiProperty({
    example: { portal: 'EDITOR', maia: 'READER' },
    additionalProperties: { type: 'string' },
  })
  apps!: Record<string, string>;

  @ApiProperty({
    type: [AuthMeAppDto],
    example: [{ slug: 'portal', name: 'Portal Trevvos', role: 'EDITOR' }],
  })
  appsList!: AuthMeAppDto[];
}
