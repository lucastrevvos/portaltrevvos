import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TodoGuestIdMiddleware } from './common/guest-id.middleware';
import { TodoGuestController } from './guest/guest.controller';
import { TodoGuestService } from './guest/guest.service';
import {
  TodoInvitesController,
  TodoListInvitesController,
} from './invites/invites.controller';
import { TodoInvitesService } from './invites/invites.service';
import { TodoItemsController } from './items/items.controller';
import { TodoItemsService } from './items/items.service';
import { TodoListsController } from './lists/lists.controller';
import { TodoListsService } from './lists/lists.service';

@Module({
  controllers: [
    TodoGuestController,
    TodoListsController,
    TodoItemsController,
    TodoInvitesController,
    TodoListInvitesController,
  ],
  providers: [
    TodoGuestService,
    TodoListsService,
    TodoItemsService,
    TodoInvitesService,
  ],
})
export class TodoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TodoGuestIdMiddleware)
      // GET /v1/todo/invites/:token é público
      .exclude({ path: 'v1/todo/invites/:token', method: RequestMethod.GET })
      .forRoutes('v1/todo');
  }
}
