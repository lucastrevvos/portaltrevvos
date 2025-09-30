import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(email: string) {
    email = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email))
      throw new BadRequestException('Email inválido');

    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (existing) return existing;

    return this.prisma.newsletterSubscriber.create({ data: { email } });
  }

  async sendEmail(subject: string, html: string, to: string) {
    const API_KEY = process.env.RESEND_API_KEY;
    if (!API_KEY) throw new Error('RESEND_API_KEY não definido');

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.NOREPLY_EMAIL || 'no-reply@trevvos.com.br',
        to,
        subject,
        html,
      }),
    });
  }

  // envia para todos (usado pelo job)
  async sendWeekly(subject: string, html: string) {
    const subs = await this.prisma.newsletterSubscriber.findMany();
    for (const s of subs) {
      try {
        await this.sendEmail(subject, html, s.email);
      } catch (e) {
        console.error('Erro enviando para', s.email, e);
      }
    }
  }

  async sendTest(to: string, subject: string | undefined, html: string) {
    const API_KEY = process.env.RESEND_API_KEY;
    if (!API_KEY) {
      throw new Error('RESEND_API_KEY não definido');
    }

    const from = process.env.NOREPLY_EMAIL || 'contato@trevvos.com.br';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: subject ?? 'Teste Trevvos (Resend)',
        html,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        `Falha ao enviar: ${res.status} ${res.statusText} - ${JSON.stringify(data)}`,
      );
    }
    return data; // normalmente vem { id: 'email_...' }
  }
}
