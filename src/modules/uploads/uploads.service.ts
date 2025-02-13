/* eslint-disable prettier/prettier */
import {Injectable} from '@nestjs/common';
import {S3} from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
    constructor(){}

    async uploadFile(dataBuffer: Buffer, fileName: string): Promise<any> {
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        const uploadResult = await s3.upload({
            Bucket: String(process.env.AWS_BUCKET),
            Body: dataBuffer,
            ACL: "public-read",
            Key: fileName,
        }).promise();

        return uploadResult;
    }

    //upload file with base64
    async uploadFileBase64(dataBuffer: any, fileName: string): Promise<any> {
        let buf = Buffer.from(dataBuffer.replace(/^data:image\/\w+;base64,/, ""),'base64')
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: 'wellavi',
            Body: buf,
            ACL: "public-read",
            ContentEncoding: 'base64',
            Key: fileName,
        }).promise();

        return uploadResult;
    }
}
