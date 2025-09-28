// uploads.controller.ts
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
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const USE_LOCAL =
  (process.env.USE_LOCAL_UPLOADS ?? 'true').toLowerCase() !== 'false';

const ensureUploadsDir = () => {
  const dir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const multerOptions = USE_LOCAL
  ? {
      storage: diskStorage({
        destination: () => ensureUploadsDir(),
        filename: (_req, file, cb) =>
          cb(null, randomUUID() + extname(file.originalname).toLowerCase()),
      }),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req: any, file: Express.Multer.File, cb: Function) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED.has(ext))
          return cb(new BadRequestException('Formato não suportado'), false);
        cb(null, true);
      },
    }
  : {
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req: any, file: Express.Multer.File, cb: Function) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED.has(ext))
          return cb(new BadRequestException('Formato não suportado'), false);
        cb(null, true);
      },
    };

function publicLocalUrl(filename: string, req: any) {
  const base =
    process.env.PUBLIC_API_URL ?? `${req.protocol}://${req.get('host')}`;
  return new URL(`/uploads/${filename}`, base).toString();
}

function publicS3Url(bucket: string, region: string, key: string) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions as any))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException('Arquivo ausente');

    // Local
    if (USE_LOCAL) {
      const filename = (file as any).filename as string | undefined;
      if (!filename) throw new BadRequestException('Falha ao salvar arquivo');
      const url = publicLocalUrl(filename, req);
      return { url, key: filename, storage: 'local' };
    }

    // S3
    const bucket = process.env.S3_BUCKET!;
    const region = process.env.AWS_REGION!;
    const ext = extname(file.originalname).toLowerCase();
    const key = `public/posts/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${ext}`;

    const s3 = new S3Client({ region });

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream',
        // NÃO usar ACL se o bucket está com Block Public Access ligado
        // ACL: 'private'
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    const url = publicS3Url(bucket, region, key);
    return { url, key, storage: 's3' };
  }
}
