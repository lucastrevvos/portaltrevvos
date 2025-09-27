"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
const fs = __importStar(require("node:fs"));
const jwt_guard_1 = require("../auth/jwt.guard");
// AWS S3 (SDK v3)
const client_s3_1 = require("@aws-sdk/client-s3");
// ===== Config =====
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
// true -> usa DISCO LOCAL (/uploads)
// false -> usa S3 (produção/Lambda)
const USE_LOCAL = (process.env.USE_LOCAL_UPLOADS ?? 'true').toLowerCase() !== 'false';
const ensureUploadsDir = () => {
    const dir = (0, node_path_1.join)(process.cwd(), 'uploads');
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    return dir;
};
// Monta as opções do Multer com base no modo escolhido
const multerOptions = USE_LOCAL
    ? {
        storage: (0, multer_1.diskStorage)({
            destination: () => ensureUploadsDir(),
            filename: (_req, file, cb) => {
                const ext = (0, node_path_1.extname)(file.originalname).toLowerCase();
                const name = (0, node_crypto_1.randomUUID)() + ext;
                cb(null, name);
            },
        }),
        limits: { fileSize: MAX_SIZE },
        fileFilter: (_req, file, cb) => {
            const ext = (0, node_path_1.extname)(file.originalname).toLowerCase();
            if (!ALLOWED.has(ext))
                return cb(new common_1.BadRequestException('Formato não suportado'), false);
            cb(null, true);
        },
    }
    : {
        // S3 -> usa memória
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: MAX_SIZE },
        fileFilter: (_req, file, cb) => {
            const ext = (0, node_path_1.extname)(file.originalname).toLowerCase();
            if (!ALLOWED.has(ext))
                return cb(new common_1.BadRequestException('Formato não suportado'), false);
            cb(null, true);
        },
    };
// Helper para montar a URL pública do arquivo local
function publicLocalUrl(filename, req) {
    // Prioriza env PUBLIC_API_URL (ex.: https://api.trevvos.com.br)
    const base = process.env.PUBLIC_API_URL ?? `${req.protocol}://${req.get('host')}`; // fallback dev
    return new URL(`/uploads/${filename}`, base).toString();
}
// Helper para montar URL pública S3
function publicS3Url(bucket, region, key) {
    // Virtual-hosted–style URL
    return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;
}
let UploadsController = class UploadsController {
    async upload(file, req) {
        if (!file)
            throw new common_1.BadRequestException('Arquivo ausente');
        // ===== Modo LOCAL: já está salvo em /uploads pelo diskStorage
        if (USE_LOCAL) {
            // filename foi definido no diskStorage
            const filename = file.filename;
            if (!filename)
                throw new common_1.BadRequestException('Falha ao salvar arquivo');
            const url = publicLocalUrl(filename, req);
            return { url };
        }
        // ===== Modo S3 (Lambda/produção)
        const bucket = process.env.S3_BUCKET;
        const region = process.env.S3_REGION;
        if (!bucket || !region) {
            throw new common_1.BadRequestException('Config S3 ausente (S3_BUCKET/S3_REGION não definidos)');
        }
        const ext = (0, node_path_1.extname)(file.originalname).toLowerCase();
        const key = `${(0, node_crypto_1.randomUUID)()}${ext}`;
        const s3 = new client_s3_1.S3Client({ region });
        await s3.send(new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype || 'application/octet-stream',
            ACL: 'public-read', // deixe público; ou remova e sirva via CloudFront/assinado
        }));
        const url = publicS3Url(bucket, region, key);
        return { url };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "upload", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads')
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map