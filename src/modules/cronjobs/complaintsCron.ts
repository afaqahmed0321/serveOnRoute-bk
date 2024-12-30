import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MongoClient } from 'mongodb';
import moment from 'moment'
import { ComplaintsRepository } from "../complaints/complaints.repository";

@Injectable()
export class ComplaintsCronService{
    constructor(
        private readonly logger: Logger,
        @Inject(forwardRef(()=> ComplaintsRepository)) private readonly complaintsRepository:ComplaintsRepository
        ) {}

    @Cron('0 0 * * *')
    async complaintsUpdate(){
        this.logger.warn('<<<<<<<<<<<<<<<<<<<<< ----- CRON-JOB STARTED ------ >>>>>>>>>>>>>>>>>')
        this.logger.log(' <<<<<<<<<<<<<<<<<<<< -------  COMPLAINTS_UPDATE ------ >>>>>>>>>>>>>>>>>')
        const query = { status: 'pending' };
        try {
            
            const result = await this.complaintsRepository.findAllComplaints(query)
            if (result.length === 0) {
                return;
            }
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',result);
            result.forEach(async (element:any) => {
                const { _id, createdAt } = element;

                const currentDate = new Date();
                const diffTime = Math.abs(currentDate.getTime() - createdAt.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 4) {
                    await this.complaintsRepository.updateComplaint({ _id }, { $set: { status: 'completed' } });
                }
            });
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
}