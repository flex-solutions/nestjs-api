import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { MessageService } from '../../multilingual/message.service';
import { LoggingService } from '../modules/logging';
import { isNullOrEmptyOrUndefined } from '../utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  logger: any;

  constructor(private messageService: MessageService,
              loggingService: LoggingService) {
                this.logger = loggingService.createLogger('HttpExceptionFilter');
              }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = (exception instanceof HttpException) ? (exception as HttpException).getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const request = ctx.getRequest();

    if (status === HttpStatus.INTERNAL_SERVER_ERROR &&
      !(exception instanceof HttpException)) {
      this.logger.error('[INTERNAL_SERVER_ERROR] Exception: ', exception);
      response.status(status).json({
        statusCode: status,
        message: {
          statusCode: status,
          error: 'INTERNAL_SERVER_ERROR',
          message: this.messageService.getMessage('unhandle_exception'),
        },
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      const httpException = exception as HttpException;
      this.handleHttpException(httpException, response, request, status);
    }
  }

  private handleHttpException(httpException: HttpException, response: any, request: any, status: HttpStatus) {
    const {
      error,
      messageCode,
      params
    } = httpException.message;

    let convertedMessage;

    if (!isNullOrEmptyOrUndefined(params)) {
      convertedMessage = this.messageService.getMessage(messageCode, ...params);
    } else {
      convertedMessage = this.messageService.getMessage(messageCode);
    }

    response.status(status).json({
      statusCode: status,
      message: {
        statusCode: status,
        error,
        message: convertedMessage,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
