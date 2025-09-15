import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import crypto from 'node:crypto'; // ✅ garante randomUUID no Node
import { AppRole, GlobalRole } from '@prisma/client';
import { AppRolesMap } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private pwd: PasswordService,
  ) {}

  private toAppsMap(
    roles: { app: { slug: string }; role: AppRole }[],
  ): AppRolesMap {
    return roles.reduce((acc, r) => {
      acc[r.app.slug] = r.role;
      return acc;
    }, {} as AppRolesMap);
  }

  // ========== REGISTER ==========
  async register(email: string, password: string, name?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      // ✅ 409 em vez de 401
      throw new ConflictException('E-mail já cadastrado.');
    }

    const hash = await this.pwd.hash(password);
    const user = await this.prisma.user.create({
      data: { email, password: hash, name },
      select: { id: true },
    });

    return { id: user.id };
  }

  // ========== LOGIN (VALIDATE) ==========
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;

    const ok = await this.pwd.compare(password, user.password);
    return ok ? user : null;
  }

  // ========== ACCESS TOKEN ==========
  private signAccess(
    user: { id: string; email: string; role: GlobalRole },
    appsMap: AppRolesMap,
  ) {
    const payload = {
      sub: user.id,
      email: user.email,
      globalRole: user.role as GlobalRole,
      apps: appsMap, // { portal: 'EDITOR', ... }
      iss: 'trevvos-auth',
    };

    return this.jwt.sign(payload, {
      expiresIn: process.env.AUTH_JWT_EXPIRES || '15m',
    });
  }

  // ========== EMITIR TOKENS ==========
  async issueTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const roles = await this.prisma.userAppRole.findMany({
      where: { userId },
      select: { role: true, app: { select: { slug: true } } },
    });

    const appsMap = this.toAppsMap(roles);
    const accessToken = this.signAccess(user, appsMap);

    // refresh token opaco (não-JWT), salvo como hash
    const refreshPlain = `${crypto.randomUUID()}.${crypto.randomUUID()}`;

    const expiresAt = addDays(
      new Date(),
      Number(process.env.AUTH_REFRESH_EXPIRES_DAYS || 30),
    );

    const bcrypt = (await import('bcrypt')).default;
    const hashed = await bcrypt.hash(refreshPlain, 10);

    await this.prisma.session.create({
      data: { userId, refreshToken: hashed, expiresAt },
    });

    return { accessToken, refreshToken: refreshPlain };
  }

  // ========== REFRESH ==========
  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh inválido');

    // 🔎 em vez de varrer todas, busque só as não-expiradas; ainda assim
    // precisamos comparar hash, então pegamos algumas e comparamos.
    const sessions = await this.prisma.session.findMany({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      take: 200, // proteção básica; ajuste conforme volume
    });

    const bcrypt = (await import('bcrypt')).default;

    for (const s of sessions) {
      if (await bcrypt.compare(refreshToken, s.refreshToken)) {
        // rotate refresh: invalida o antigo e emite um novo par
        await this.prisma.session.delete({ where: { id: s.id } });
        return this.issueTokens(s.userId);
      }
    }
    throw new UnauthorizedException('Refresh inválido');
  }

  // ========== LOGOUT ==========
  async logout(refreshToken: string) {
    if (!refreshToken) return { ok: true }; // idempotente

    const sessions = await this.prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const bcrypt = (await import('bcrypt')).default;
    for (const s of sessions) {
      if (await bcrypt.compare(refreshToken, s.refreshToken)) {
        await this.prisma.session.delete({ where: { id: s.id } });
        break;
      }
    }
    // controller pode responder 204; aqui retornamos só um ok simbólico
    return { ok: true };
  }

  // ========== /auth/me ==========
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true, // GlobalRole
        // (não retornamos password/secretos)
      },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const roles = await this.prisma.userAppRole.findMany({
      where: { userId },
      select: { role: true, app: { select: { slug: true, name: true } } },
    });

    // ✅ formato enxuto e ideal pro front:
    const appsMap: Record<string, string> = {};
    const appsArray = roles.map((r) => {
      appsMap[r.app.slug] = r.role;
      return { slug: r.app.slug, name: r.app.name, role: r.role };
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      globalRole: user.role,
      apps: appsMap, // { portal: 'EDITOR', ... }  << usado para canPublish
      appsList: appsArray, // opcional, útil para UI/admin
    };
  }
}
