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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { QueryBidDto } from './dto/query-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ROLE } from '@/enums/role.enum';
import { Auth } from '@/decorators/role.decorator';

@ApiTags('Bid')
@Controller('bid')
@ApiBearerAuth()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidService.create(createBidDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: QueryBidDto) {
    return this.bidService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Auth(
    ROLE.ADMIN,
    ROLE.SUPER_ADMIN,
    ROLE.NORMAL_USER,
    ROLE.ADMIN,
    ROLE.MANAGER,
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidService.update(id, updateBidDto);
  }

  @UseGuards(JwtAuthGuard)
  @Auth(
    ROLE.ADMIN,
    ROLE.SUPER_ADMIN,
    ROLE.NORMAL_USER,
    ROLE.ADMIN,
    ROLE.MANAGER,
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidService.remove(id);
  }
}
