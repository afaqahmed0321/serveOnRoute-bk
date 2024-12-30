import {Controller, Post, UploadedFile,UploadedFiles, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {FileInterceptor,FilesInterceptor} from "@nestjs/platform-express";
import {UploadsService} from '@/modules/uploads/uploads.service';
import {diskStorage} from 'multer';
import {Helper} from '@/modules/uploads/shared/helper';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
    // @Post()
    // @UseInterceptors(
    //     FileInterceptor('file', {
    //         storage: diskStorage({
    //             destination: './public/uploads',
    //             filename: Helper.customFileName,
    //         }),
    //     }),
    // )
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //         schema: {
    //             type: 'object',
    //             properties: {
    //                 file: {
    //                     type: 'string',
    //                     format: 'binary',
    //                 },
    //
    //             },
    //         },
    //     })
    // uploadFile(@UploadedFile() file: Express.Multer.File) {
    //     return {
    //         status: 200,
    //         message: 'Upload successfully',
    //         data: file.filename,
    //     };
    // }

    constructor(private readonly uploadsService: UploadsService) {}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },

            },
        },
    })
    @Post()
    // @UseInterceptors(FileInterceptor('file'))
    @UseInterceptors(FileInterceptor('file',{
        limits: { fileSize: 10 * 1024 * 1024 },
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
        const uploadedFile = await this.uploadsService.uploadFile(file.buffer,  Date.now()+ '-' +file.originalname );
        return {
            status: 200,
            message: 'Upload successfully',
            data: uploadedFile.Location,
        };
    }   

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                },

            },
        },
    })
    // @UseInterceptors(FileInterceptor('file'))
    @Post('multiple-file-upoads')
    @UseInterceptors(FilesInterceptor('files', 10, {
        limits: { fileSize: 10 * 1024 * 1024 },
    }))
    async uploadMultipeFiles(
        @UploadedFiles()
        files: Array<Express.Multer.File>) {
            console.log(files)
        let uploadedFilesArray = []
        for (let i = 0; i < files.length; i++) {
            let item = files[i];
            const temp = await this.uploadsService.uploadFile(item.buffer, Date.now()+ '-' + item.originalname  );
            uploadedFilesArray.push(temp)
        }
        return {
            status: 200,
            message: 'Upload successfully',
            data: uploadedFilesArray.map((item) => {
                return item.Location
            }),
        };
    }
}
