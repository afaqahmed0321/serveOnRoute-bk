import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  RpcExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { USER_EXISTS, DB_ERROR } from '@/constants/constants';

@Catch(MongoError)
export class mongooseFilter implements RpcExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;
    const responseMessage = (message: string) => {
      response.status(status).json({
        statusCode: status,
        message,
      });
    };
    switch (exception.code) {
      case 11000:
        responseMessage(USER_EXISTS);
        break;
      default: {
        responseMessage(DB_ERROR);
      }
    }
  }
}
