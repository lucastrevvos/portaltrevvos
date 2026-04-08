import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
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

  @Post(':listId/leave')
  async leave(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.leaveList(guestId, listId);
  }

  @Delete(':listId')
  async remove(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.deleteList(guestId, listId);
  }
}
