import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(ex: any, host: ArgumentsHost) {
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
}
