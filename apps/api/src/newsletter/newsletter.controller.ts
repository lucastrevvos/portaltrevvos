import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SendTestDto } from './dto/send-test.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private svc: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    const sub = await this.svc.subscribe(email);
    return { ok: true, sub };
  }

  @Post('test')
  async test(@Body() dto: SendTestDto) {
    const result = await this.svc.sendTest(dto.to, dto.subject, dto.html);
    return { ok: true, result };
  }
}
