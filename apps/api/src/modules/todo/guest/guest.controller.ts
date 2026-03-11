import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TodoGuestService } from './guest.service';

@Controller('v1/todo/guest')
export class TodoGuestController {
  constructor(private service: TodoGuestService) {}

  @Post('bootstrap')
  async bootstrap(@Req() req: Request) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.bootstrap(guestId);
  }
}
