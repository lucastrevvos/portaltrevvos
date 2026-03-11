import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateTodoInviteDto } from './dto/create-invite.dto';
import { TodoInvitesService } from './invites.service';

@Controller('v1/todo/shared-lists/:listId/invites')
export class TodoListInvitesController {
  constructor(private service: TodoInvitesService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @Body() body: CreateTodoInviteDto,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.createInvite(guestId, listId, body);
  }

  @Post(':token/revoke')
  async revoke(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @Param('token') token: string,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.revokeInvite(guestId, listId, token);
  }
}

@Controller('v1/todo/invites')
export class TodoInvitesController {
  constructor(private service: TodoInvitesService) {}

  // público (sem X-Guest-Id)
  @Get(':token')
  async getPublic(@Param('token') token: string) {
    return this.service.getInvitePublic(token);
  }

  // exige X-Guest-Id (para saber quem está entrando)
  @Post(':token/join')
  async join(@Req() req: Request, @Param('token') token: string) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.joinInvite(guestId, token);
  }
}

