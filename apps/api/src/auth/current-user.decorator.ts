import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as {
      sub: string;
      email: string;
      globalRole: string;
      apps?: Record<string, string>;
    };
  },
);
