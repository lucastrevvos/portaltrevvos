import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: 'clx123abc456def789',
    description: 'Identificador do usuário criado',
  })
  id!: string;
}
