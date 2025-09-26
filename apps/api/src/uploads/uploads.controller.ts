import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { JwtAuthGuard } from '../auth/jwt.guard';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const name = randomUUID() + ext;
          cb(null, name);
        },
      }),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED.has(ext)) {
          return cb(new BadRequestException('Formato não suportado'), false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new Error('Arquivo ausente');

    // 1) tente usar variável de ambiente pública (melhor p/ prod)
    const base =
      process.env.PUBLIC_API_URL ?? // ex: http://localhost:3333
      // 2) fallback: monta via request (dev)
      `${req.protocol}://${req.get('host')}`;

    const url = new URL(`/uploads/${file.filename}`, base).toString();
    return { url }; // <- absoluta
  }
}
