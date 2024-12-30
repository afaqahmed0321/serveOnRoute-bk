import { Catch, ArgumentsHost,WsExceptionFilter } from '@nestjs/common';
import { WsException,BaseWsExceptionFilter } from '@nestjs/websockets';

// @Catch(WsException)
// export class WSExceptionsFilter extends BaseWsExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     super.catch(exception, host);
//   }
// }

@Catch(WsException)
export class CustomWsExceptionFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.log("------------------->>>>>WSEXCEPTIONFILTER-----------------",exception)
    const client = host.switchToWs().getClient();
    const errorMessage = exception.getError();
    console.log(`Caught WS Exception: ${exception.message}`);
    client.emit('error', errorMessage);
  }
}