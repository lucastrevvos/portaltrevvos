import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { type JwtPayload } from './jwt-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { id } = await this.auth.register(dto.email, dto.password, dto.name);
    return { id };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    return this.auth.issueTokens(user.id);
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    const tokens = await this.auth.refresh(body.refreshToken).catch(() => null);
    if (!tokens) throw new UnauthorizedException('Refresh token inválido');
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: JwtPayload) {
    return this.auth.me(user.sub);
  }
}
