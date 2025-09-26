// apps/api/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Adapter Neon (versão que espera PoolConfig)
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // cache de conexões (recomendado para serverless)
    neonConfig.fetchConnectionCache = true;

    const prodUrl = process.env.DATABASE_URL_PROD;

    if (prodUrl) {
      // ⬇️ Esta versão do adapter espera um PoolConfig (objeto), não um Pool nem neon()
      const adapter = new PrismaNeon({
        connectionString: prodUrl,
        // Se quiser, pode ajustar mais opções aqui (ssl, max, idleTimeoutMillis etc)
      });
      super({ adapter });
    } else {
      // local: usa DATABASE_URL normal do Prisma
      super();
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
