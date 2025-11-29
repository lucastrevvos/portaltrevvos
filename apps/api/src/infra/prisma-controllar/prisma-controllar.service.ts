import { Injectable, INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated';

@Injectable()
export class PrismaControllarService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
  async enableShutdownHooks(app: INestApplication) {
    (this.$on as any)('beforeExit', async () => {
      await app.close();
    });
  }
}
