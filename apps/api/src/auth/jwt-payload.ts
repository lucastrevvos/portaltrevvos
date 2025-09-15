import { AppRole, GlobalRole } from '@prisma/client';

export type AppRolesMap = Record<string, AppRole>;

export type JwtPayload = {
  sub: string;
  email: string;
  globalRole: GlobalRole;
  apps?: AppRolesMap;
  iss?: string;
  iat?: number;
  exp?: number;
};
