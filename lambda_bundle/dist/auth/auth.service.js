"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const password_service_1 = require("./password.service");
const jwt_1 = require("@nestjs/jwt");
const date_fns_1 = require("date-fns");
const node_crypto_1 = __importDefault(require("node:crypto")); // ✅ garante randomUUID no Node
let AuthService = class AuthService {
    constructor(prisma, jwt, pwd) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.pwd = pwd;
    }
    toAppsMap(roles) {
        return roles.reduce((acc, r) => {
            acc[r.app.slug] = r.role;
            return acc;
        }, {});
    }
    // ========== REGISTER ==========
    async register(email, password, name) {
        const exists = await this.prisma.user.findUnique({ where: { email } });
        if (exists) {
            // ✅ 409 em vez de 401
            throw new common_1.ConflictException('E-mail já cadastrado.');
        }
        const hash = await this.pwd.hash(password);
        const user = await this.prisma.user.create({
            data: { email, password: hash, name },
            select: { id: true },
        });
        return { id: user.id };
    }
    // ========== LOGIN (VALIDATE) ==========
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password)
            return null;
        const ok = await this.pwd.compare(password, user.password);
        return ok ? user : null;
    }
    // ========== ACCESS TOKEN ==========
    signAccess(user, appsMap) {
        const payload = {
            sub: user.id,
            email: user.email,
            globalRole: user.role,
            apps: appsMap, // { portal: 'EDITOR', ... }
            iss: 'trevvos-auth',
        };
        return this.jwt.sign(payload, {
            expiresIn: process.env.AUTH_JWT_EXPIRES || '15m',
        });
    }
    // ========== EMITIR TOKENS ==========
    async issueTokens(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        const roles = await this.prisma.userAppRole.findMany({
            where: { userId },
            select: { role: true, app: { select: { slug: true } } },
        });
        const appsMap = this.toAppsMap(roles);
        const accessToken = this.signAccess(user, appsMap);
        // refresh token opaco (não-JWT), salvo como hash
        const refreshPlain = `${node_crypto_1.default.randomUUID()}.${node_crypto_1.default.randomUUID()}`;
        const expiresAt = (0, date_fns_1.addDays)(new Date(), Number(process.env.AUTH_REFRESH_EXPIRES_DAYS || 30));
        const bcrypt = (await Promise.resolve().then(() => __importStar(require('bcrypt')))).default;
        const hashed = await bcrypt.hash(refreshPlain, 10);
        await this.prisma.session.create({
            data: { userId, refreshToken: hashed, expiresAt },
        });
        return { accessToken, refreshToken: refreshPlain };
    }
    // ========== REFRESH ==========
    async refresh(refreshToken) {
        if (!refreshToken)
            throw new common_1.UnauthorizedException('Refresh inválido');
        // 🔎 em vez de varrer todas, busque só as não-expiradas; ainda assim
        // precisamos comparar hash, então pegamos algumas e comparamos.
        const sessions = await this.prisma.session.findMany({
            where: { expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
            take: 200, // proteção básica; ajuste conforme volume
        });
        const bcrypt = (await Promise.resolve().then(() => __importStar(require('bcrypt')))).default;
        for (const s of sessions) {
            if (await bcrypt.compare(refreshToken, s.refreshToken)) {
                // rotate refresh: invalida o antigo e emite um novo par
                await this.prisma.session.delete({ where: { id: s.id } });
                return this.issueTokens(s.userId);
            }
        }
        throw new common_1.UnauthorizedException('Refresh inválido');
    }
    // ========== LOGOUT ==========
    async logout(refreshToken) {
        if (!refreshToken)
            return { ok: true }; // idempotente
        const sessions = await this.prisma.session.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
        const bcrypt = (await Promise.resolve().then(() => __importStar(require('bcrypt')))).default;
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
    async me(userId) {
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
        if (!user)
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        const roles = await this.prisma.userAppRole.findMany({
            where: { userId },
            select: { role: true, app: { select: { slug: true, name: true } } },
        });
        // ✅ formato enxuto e ideal pro front:
        const appsMap = {};
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        password_service_1.PasswordService])
], AuthService);
//# sourceMappingURL=auth.service.js.map