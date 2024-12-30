import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RequestUserInterface from '@/interfaces/request-user.interface';
import { User } from '@/decorators/user.decorator';
import { QueryParcelDto } from './dto/query-parcel.dto';
import { QueryTopTenDto } from './dto/query-topten.dto';
import { Auth } from '@/decorators/role.decorator';
import { ROLE } from '@/enums/role.enum';
import { CancelParcelDto } from './dto/cancel-parcel.dto';
import { CompleteParcelDto } from './dto/complete-parcel.dto';

@ApiTags('Parcel')
@Controller('parcel')
@ApiBearerAuth()
export class ParcelController {
  constructor(private readonly parcelService: ParcelService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createParcelDto: CreateParcelDto,
    @User() user: RequestUserInterface,
  ) {
    if (files) createParcelDto.files = files;
    createParcelDto.customer_id = user._id;
    return this.parcelService.create(createParcelDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: QueryParcelDto) {
    return this.parcelService.findAll(query);
  }

  @ApiBearerAuth()
  @Get('counts')
  countsParcel() {
    return this.parcelService.countParcel();
  }

  @ApiBearerAuth()
  @Get('top-ten')
  topTen(@Query() query: QueryTopTenDto) {
    return this.parcelService.topTen(query.queryFor);
  }

  @ApiBearerAuth()
  @Auth(ROLE.RIDER, ROLE.NORMAL_USER)
  @Post('cancel')
  cancelParcel(
    @Body() body: CancelParcelDto,
    @User() user: RequestUserInterface,
  ) {
    return this.parcelService.cancelledParcel(body, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parcelService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() updateParcelDto: UpdateParcelDto,
  ) {
    console.log('UpdateBODY----------------->', updateParcelDto);
    console.log('\n Id----------------->', id);
    if (files) updateParcelDto.files = files;
    return this.parcelService.update(id, updateParcelDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verifyOTP/:id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  verifyOTP(
    @Param('id') id: string,
    @Body() completeParcelDto: CompleteParcelDto,
    @User() user: RequestUserInterface,
  ) {
    return this.parcelService.verifyOTP(id, completeParcelDto, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parcelService.remove(id);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('/notify/:id')
  // notifyRidersAboutParcel(@Param('id') id: string) {
  //   return this.parcelService.notifyRiders(id);
  // }
}
