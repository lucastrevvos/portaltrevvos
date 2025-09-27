import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwt;
    private pwd;
    constructor(prisma: PrismaService, jwt: JwtService, pwd: PasswordService);
    private toAppsMap;
    register(email: string, password: string, name?: string): Promise<{
        id: string;
    }>;
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        password: string | null;
        name: string | null;
        role: import("@prisma/client").$Enums.GlobalRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    private signAccess;
    issueTokens(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        ok: boolean;
    }>;
    me(userId: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        globalRole: import("@prisma/client").$Enums.GlobalRole;
        apps: Record<string, string>;
        appsList: {
            slug: string;
            name: string;
            role: import("@prisma/client").$Enums.AppRole;
        }[];
    }>;
}
