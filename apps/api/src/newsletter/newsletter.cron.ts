import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { NewsletterService } from './newsletter.service';

@Injectable()
export class NewsletterCron implements OnModuleInit {
  constructor(private svc: NewsletterService) {}

  onModuleInit() {
    // agenda semanal — domingo 10:00 UTC (ajusta pra seu fuso)
    cron.schedule('0 10 * * 0', async () => {
      const subject = 'Trevvos — novidades da semana';
      const html = `<h1>Novidades Trevvos</h1><p>Resumo e links...</p>`;
      await this.svc.sendWeekly(subject, html);
    });
  }
}
