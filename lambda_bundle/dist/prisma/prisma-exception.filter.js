"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaExceptionFilter = class PrismaExceptionFilter {
    catch(ex, host) {
        const res = host.switchToHttp().getResponse();
        // Unique
        if (ex?.code === 'P2002') {
            const target = ex?.meta?.target;
            const fields = Array.isArray(target) ? target : [target].filter(Boolean);
            return res.status(409).json({
                type: 'about:blank', // Problem Details style
                title: 'Conflict',
                status: 409,
                code: 'P2002',
                message: 'Valor único já existe.',
                fields, // 👈 ['slug'] ou ['email', 'id']
            });
        }
        // Not Found
        if (ex?.code === 'P2025') {
            return res.status(404).json({
                type: 'about:blank',
                title: 'Not Found',
                status: 404,
                code: 'P2025',
                message: ex?.meta?.cause || 'Registro não encontrado.',
            });
        }
        // Validation (payload inválido)
        if (ex?.name === 'PrismaClientValidationError') {
            return res.status(400).json({
                type: 'about:blank',
                title: 'Bad Request',
                status: 400,
                code: 'VALIDATION',
                message: 'Dados inválidos.',
            });
        }
        // Fallback
        return res.status(500).json({
            type: 'about:blank',
            title: 'Internal Server Error',
            status: 500,
            code: 'INTERNAL',
            message: 'Erro interno',
        });
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError, client_1.Prisma.PrismaClientUnknownRequestError, client_1.Prisma.PrismaClientValidationError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map