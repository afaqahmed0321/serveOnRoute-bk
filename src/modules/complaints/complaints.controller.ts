import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req, UploadedFiles, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ProofComplaintDto } from './dto/proof-complaint.dto';
import { QueryComplaintsDto } from './dto/query-complaints.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@ApiTags('Complaint')
@ApiBearerAuth()
@Controller('complaints')

export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}
  
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {
        limits: { fileSize: 10 * 1024 * 1024 },
    }))
  create(@UploadedFiles() files:Array<Express.Multer.File>, @Body() createComplaintDto: CreateComplaintDto, @Req() req:Request ) {
    console.log(createComplaintDto)
    createComplaintDto.files = files
    return this.complaintsService.create(req.user,createComplaintDto);
  }
 
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        proof_description:{
          type:'string',
        },
        proof_files:{
              type:'array',
              items:{
                type:'string',
                format:'binary'
          }
        },
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('addProofs/:complain_id')
  @UseInterceptors(FilesInterceptor('proof_files', 10, {
        limits: { fileSize: 10 * 1024 * 1024 },
    }))
  addProofs(@UploadedFiles() files: Array<Express.Multer.File>,@Req() req:Request, @Param('complain_id') complain_id:string, @Body() updateBody: ProofComplaintDto) {
    if(files)
    updateBody.proof_files = files
    return this.complaintsService.addProofs(complain_id,req.user,updateBody);
  }

  
  @Get()
  findAll( @Query() query:QueryComplaintsDto) {
    return this.complaintsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    return this.complaintsService.update(id, updateComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintsService.remove(id);
  }
}
