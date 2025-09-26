// src/lambda.ts
import serverless from 'serverless-http';
import { createApp } from './main';

let cached: any;

async function bootstrap() {
  if (!cached) {
    const app = await createApp();
    await app.init(); // não faz listen — Lambda chama o Express internamente
    const expressApp = app.getHttpAdapter().getInstance();
    cached = serverless(expressApp, {
      binary: ['image/*', 'application/octet-stream'],
    });
  }
  return cached;
}

export const handler = async (event: any, context: any) => {
  process.env.NODE_ENV = 'lambda'; // pra garantir o ramo certo
  const server = await bootstrap();
  return server(event, context);
};
