/* eslint-disable prettier/prettier */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    let mensaje = null;

    switch (exception.driverError.errno) {
      case 1451:
        mensaje = 'Este registro esta siendo usado por otra tabla';
        break;
        case 1062:
          mensaje = 'Este registro debe ser unico';
          break;    
      default:
        mensaje = exception;
        break;
    }
    const errorResponse = {
      timestamp: new Date().toLocaleString(),
      message: mensaje,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
