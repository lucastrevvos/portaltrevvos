import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TodoGuestIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const guestId = req.header('x-guest-id');

    if (!guestId) {
      throw new BadRequestException('Missing header: X-Guest-Id');
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(guestId)) {
      throw new BadRequestException('Invalid X-Guest-Id (must be UUID)');
    }

    (req as Request & { todoGuestId: string }).todoGuestId = guestId;
    next();
  }
}
