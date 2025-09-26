import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // CORS vindo do env (produção) + fallback para dev
  const origins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    credentials: true,
    allowedHeaders: ['content-type', 'authorization', 'x-app-slug'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // ⛔️ Em Lambda não tem disco persistente; evita servir /uploads lá.
  // Mantemos estático só no dev/local (ou se você explicitamente permitir).
  const useLocalUploads =
    process.env.USE_LOCAL_UPLOADS === 'true' &&
    process.env.NODE_ENV !== 'lambda';

  if (useLocalUploads) {
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());

  return app;
}

// Execução normal (dev): npm run start:dev
if (process.env.NODE_ENV !== 'lambda') {
  (async () => {
    const app = await createApp();
    await app.listen(process.env.PORT || 3333, '0.0.0.0');
    // eslint-disable-next-line no-console
    console.log(`API rodando em http://localhost:${process.env.PORT || 3333}`);
  })();
}
