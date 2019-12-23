
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  constructor(@Inject('winston') private readonly logger: Logger) { }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(`
    ${request.method} ${request.url}
    `, exception.stack, 'HttpExceptionFilter');

    Logger.error(`
    ${request.method} ${request.url}
    `, exception.stack, 'HttpExceptionFilter')

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message.error || exception.message || null : 'Internal Server Error',
      });
  }
}