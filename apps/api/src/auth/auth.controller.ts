import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import { AuthMeResponseDto } from './dto/auth-me-response.dto';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { type JwtPayload } from './jwt-payload';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail já cadastrado.',
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { id } = await this.auth.register(dto.email, dto.password, dto.name);
    return { id };
  }

  @ApiOperation({ summary: 'Autenticar usuário e emitir tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login efetuado com sucesso.',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas.',
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);

    if (!user) throw new UnauthorizedException('Credenciais invÃ¡lidas');

    return this.auth.issueTokens(user.id);
  }

  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Tokens renovados com sucesso.',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido.',
  })
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    return this.auth.refresh(body.refreshToken);
  }

  @ApiOperation({ summary: 'Encerrar sessão a partir do refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 204,
    description: 'Logout processado.',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido.',
  })
  @HttpCode(204)
  @Post('logout')
  async logout(@Body() body: RefreshTokenDto) {
    const tokens = await this.auth.refresh(body.refreshToken).catch(() => null);
    if (!tokens) throw new UnauthorizedException('Refresh token invÃ¡lido');
    return tokens;
  }

  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiBearerAuth('bearer')
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário autenticado.',
    type: AuthMeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: JwtPayload) {
    return this.auth.me(user.sub);
  }
}
