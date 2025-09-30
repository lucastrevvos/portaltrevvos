import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';

@Module({
  providers: [NewsletterService],
  controllers: [NewsletterController],
  exports: [NewsletterService],
})
export class NewsletterModule {}
