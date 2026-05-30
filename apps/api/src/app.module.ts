import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadsModule } from './uploads/uploads.module';
import { HealthModule } from './health/health.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { AiModule } from './modules/ai/ai.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PostsModule,
    TagsModule,
    CategoriesModule,
    UploadsModule,
    HealthModule,
    NewsletterModule,
    AiModule,
    TodoModule,
  ],
})
export class AppModule {}
