"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
// src/main.ts
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const prisma_exception_filter_1 = require("./prisma/prisma-exception.filter");
const node_path_1 = require("node:path");
async function createApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            process.env.ALLOWED_ORIGIN || '', // ex: https://trevvos.com.br
        ].filter(Boolean),
        credentials: true,
        allowedHeaders: ['content-type', 'authorization', 'x-app-slug'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });
    // dev: servir /uploads local
    if (!process.env.S3_BUCKET) {
        app.useStaticAssets((0, node_path_1.join)(process.cwd(), 'uploads'), {
            prefix: '/uploads/',
        });
    }
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    return app;
}
async function bootstrap() {
    const app = await createApp();
    await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map