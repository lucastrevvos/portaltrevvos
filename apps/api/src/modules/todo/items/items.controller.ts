import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { TodoItemsService } from './items.service';

@Controller('v1/todo/shared-lists/:listId/items')
export class TodoItemsController {
  constructor(private service: TodoItemsService) {}

  @Get()
  async list(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.listItems(guestId, listId);
  }

  @Post()
  async create(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @Body() body: CreateTodoItemDto,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.createItem(guestId, listId, body);
  }

  @Patch(':itemId')
  async update(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @Param('itemId', new ParseUUIDPipe({ version: '4' })) itemId: string,
    @Body() body: UpdateTodoItemDto,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.updateItem(guestId, listId, itemId, body);
  }

  @Delete(':itemId')
  async remove(
    @Req() req: Request,
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @Param('itemId', new ParseUUIDPipe({ version: '4' })) itemId: string,
  ) {
    const guestId = (req as Request & { todoGuestId: string }).todoGuestId;
    return this.service.deleteItem(guestId, listId, itemId);
  }
}
