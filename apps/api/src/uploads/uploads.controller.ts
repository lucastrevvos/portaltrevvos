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

// AWS S3 (SDK v3)
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// ===== Config =====
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// true -> usa DISCO LOCAL (/uploads)
// false -> usa S3 (produção/Lambda)
const USE_LOCAL =
  (process.env.USE_LOCAL_UPLOADS ?? 'true').toLowerCase() !== 'false';

const ensureUploadsDir = () => {
  const dir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

// Monta as opções do Multer com base no modo escolhido
const multerOptions = USE_LOCAL
  ? {
      storage: diskStorage({
        destination: () => ensureUploadsDir(),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const name = randomUUID() + ext;
          cb(null, name);
        },
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
      // S3 -> usa memória
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req: any, file: Express.Multer.File, cb: Function) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED.has(ext))
          return cb(new BadRequestException('Formato não suportado'), false);
        cb(null, true);
      },
    };

// Helper para montar a URL pública do arquivo local
function publicLocalUrl(filename: string, req: any) {
  // Prioriza env PUBLIC_API_URL (ex.: https://api.trevvos.com.br)
  const base =
    process.env.PUBLIC_API_URL ?? `${req.protocol}://${req.get('host')}`; // fallback dev

  return new URL(`/uploads/${filename}`, base).toString();
}

// Helper para montar URL pública S3
function publicS3Url(bucket: string, region: string, key: string) {
  // Virtual-hosted–style URL
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(
    key,
  )}`;
}

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions as any))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException('Arquivo ausente');

    // ===== Modo LOCAL: já está salvo em /uploads pelo diskStorage
    if (USE_LOCAL) {
      // filename foi definido no diskStorage
      const filename = (file as any).filename as string | undefined;
      if (!filename) throw new BadRequestException('Falha ao salvar arquivo');

      const url = publicLocalUrl(filename, req);
      return { url };
    }

    // ===== Modo S3 (Lambda/produção)
    const bucket = process.env.S3_BUCKET;
    const region = process.env.S3_REGION;

    if (!bucket || !region) {
      throw new BadRequestException(
        'Config S3 ausente (S3_BUCKET/S3_REGION não definidos)',
      );
    }

    const ext = extname(file.originalname).toLowerCase();
    const key = `${randomUUID()}${ext}`;

    const s3 = new S3Client({ region });

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream',
        ACL: 'public-read', // deixe público; ou remova e sirva via CloudFront/assinado
      }),
    );

    const url = publicS3Url(bucket, region, key);
    return { url };
  }
}
