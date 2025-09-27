import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { type JwtPayload } from './jwt-payload';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    me(user: JwtPayload): Promise<{
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
