import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards, Logger, UseFilters } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomWsExceptionFilter } from '@/filters/wsException.filter';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { User } from '@/decorators/user.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(CustomWsExceptionFilter)
export class NotificationGateway {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private users: any;
  constructor(
    private readonly chatService: NotificationsService,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.users = [];
  }

  async afterInit() {
    this.eventEmitter.on('notification', (data: any) => {
      console.log('Notification Gateway Enter');
      this.server.emit('notification', data);
    });
    this.logger.log('Notification Gateway Init');
  }

  // @UseFilters(new WSExceptionsFilter)
  async handleConnection(socket: Socket) {
    this.logger.log('Notifications Connection');
  }

  async handleDisconnect(socket: Socket) {}
}
