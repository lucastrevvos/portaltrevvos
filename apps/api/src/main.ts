// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';

function parseOrigins(): string[] {
  const list = [
    'http://localhost:3000',
    process.env.ALLOWED_ORIGIN || '', // legado (ex: https://trevvos.com.br)
    ...(process.env.WEB_ORIGIN?.split(',') ?? []), // novo: múltiplas URLs separadas por vírgula
  ]
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(list));
}

export async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // segurança e performance
  app.use(helmet());
  app.use(compression());
  app.set('trust proxy', 1); // caso esteja atrás de proxy/CDN

  // CORS
  app.enableCors({
    origin: parseOrigins(),
    credentials: true,
    allowedHeaders: ['content-type', 'authorization', 'x-app-slug'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  });

  // dev: servir /uploads local quando não houver S3 configurado
  if (!process.env.S3_BUCKET) {
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
      setHeaders(res) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      },
    });
  }

  // validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    }),
  );

  // erros de prisma
  app.useGlobalFilters(new PrismaExceptionFilter());

  // opcional: prefixo global
  // app.setGlobalPrefix('api');

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const port = Number(process.env.PORT) || 3333;
  await app.listen(port, '0.0.0.0');
  // console.log(`API on http://localhost:${port}`);
}
bootstrap();
