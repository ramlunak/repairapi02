/* eslint-disable prettier/prettier */
import {
  ArgumentsHost,
  BadGatewayException,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    /*const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : ;**/

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).message || null;
        break;
      case NotFoundException:
        status = (exception as NotFoundException).getStatus();
        message = (exception as NotFoundException).message || null;
        break;
      case UnauthorizedException:
        status = (exception as UnauthorizedException).getStatus();
        message = (exception as UnauthorizedException).message || null;
        break;
      case ConflictException:
        status = (exception as ConflictException).getStatus();
        message = (exception as ConflictException).message || null;
        break;
      case BadRequestException:
        status = (exception as BadRequestException).getStatus();
        const repos: any =
          (exception as BadRequestException).getResponse() || null;
        message = repos.message;
        break;
      case UnprocessableEntityException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).message || null;
      case QueryFailedError:
        status = HttpStatus.BAD_REQUEST;
        switch ((exception as QueryFailedError).driverError.errno) {
          case 1451:
            message = 'Este registro esta siendo usado por otra tabla';
            break;
          case 1062:
            message = 'Este registro debe ser unico';
            break;
          default:
            message = exception;
            break;
        }
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = 'No existe la entidad';
        break;
      default:
        message = message.toString();
        break;
    }

    const errorResponse = {
      timestamp: new Date().toLocaleString(),
      message: message,
      code: status,
      url: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
