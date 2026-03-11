import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TodoListsService } from './lists.service';

@Controller('v1/todo/shared-lists')
export class TodoListsController {
  constructor(private service: TodoListsService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: { title: string }) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.createSharedList(guestId, body?.title ?? '');
  }

  @Get()
  async list(@Req() req: Request) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.listMySharedLists(guestId);
  }
}
