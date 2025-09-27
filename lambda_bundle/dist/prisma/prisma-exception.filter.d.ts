import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class PrismaExceptionFilter implements ExceptionFilter {
    catch(ex: any, host: ArgumentsHost): any;
}
