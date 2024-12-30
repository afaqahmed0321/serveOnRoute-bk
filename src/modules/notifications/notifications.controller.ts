import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { CreateNotificationTokenDto } from './dto/create-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@/decorators/user.decorator';
import { UpdateNotificationTokenDto } from './dto/update-token.dto';
import { AdminNotificationDto } from './dto/adminNotification.dto';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept')
  accept(@Body() body: CreateNotificationTokenDto, @User() user: any) {
    return this.notificationsService.acceptNotifications(user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-token')
  updateToken(@Body() body: UpdateNotificationTokenDto, @User() user: any) {
    return this.notificationsService.updateNotificationsToken(user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove-token')
  removeToken(@User() user: any) {
    return this.notificationsService.removeNotificationsToken(user);
  }

  @Get()
  findAll(@Query() query: QueryNotificationDto) {
    return this.notificationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @Post('AdminNotifications')
  AdminNotifications(@Body() body: AdminNotificationDto) {
    return this.notificationsService.adminNotification(body);
  }
}
