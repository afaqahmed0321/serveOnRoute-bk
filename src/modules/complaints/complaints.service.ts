import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ComplaintsRepository } from './complaints.repository';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { UsersService } from '../users/users.service';
import { ProofComplaintDto } from './dto/proof-complaint.dto';
import { UploadsService } from '../uploads/uploads.service';
import { ObjectId } from 'mongodb';
import * as _ from 'lodash';
import { QueryComplaintsDto } from './dto/query-complaints.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    private readonly complaintsRepository: ComplaintsRepository,
    private readonly usersService: UsersService,
    @Inject(UploadsService) private readonly uploadsService: UploadsService,
  ) {}

  async create(user: any, createComplaintDto: CreateComplaintDto) {
    console.log(createComplaintDto);
    let { files } = createComplaintDto;
    let body: any = {};
    let complainant_proof: any = {
      description: createComplaintDto.description,
    };
    if (files) {
      let uploadedFilesArray = [];
      for (let i = 0; i < files.length; i++) {
        let item = files[i];
        const temp = await this.uploadsService.uploadFile(
          item.buffer,
          Date.now() + '-' + item.originalname,
        );
        uploadedFilesArray.push(temp.Location);
      }
      complainant_proof.images = uploadedFilesArray;
    }
    body.complainant_proof = complainant_proof;
    body.complain_against = createComplaintDto.complain_against;
    body.complainant = user?._id;
    body.parcel = new ObjectId(createComplaintDto.parcel);
    return this.complaintsRepository.createComplaint(body);
  }

  async findAll(query: QueryComplaintsDto) {
    const filter: any = _.pick(query, [
      'kind',
      'complainant',
      'complain_against',
      'parcel',
    ]);

    if (filter.parcel) filter.parcel = new ObjectId(filter.parcel);
    const options = _.pick(query, ['page', 'limit', 'sort', 'select']);
    options.populate = [
      { path: 'parcel', select: '' },
      { path: 'complainant', select: '' },
      { path: 'complain_against', select: '' },
    ];
    return await this.complaintsRepository.findComplaints(filter, options);
  }

  async findOne(id: string) {
    return await this.complaintsRepository.findComplaintById(id);
  }

  async addProofs(complain_id: string, user: any, data: ProofComplaintDto) {
    let outThis = this;
    async function uploadAllFiles(
      proof_files: ProofComplaintDto['proof_files'],
    ) {
      let uploadedFilesArray;
      if (proof_files) {
        uploadedFilesArray = [];
        for (let i = 0; i < proof_files.length; i++) {
          let item = proof_files[i];
          const temp = await outThis.uploadsService.uploadFile(
            item.buffer,
            Date.now() + '-' + item.originalname,
          );
          uploadedFilesArray.push(temp.Location);
        }
      }
      return uploadedFilesArray;
    }

    let _id: any = user._id;
    let body: any = {};
    let complain: any = await this.complaintsRepository.fetchComplaintById(
      complain_id,
    );
    let { proof_files } = data;
    if (_id.equals(complain?.complainant)) {
      let complainant_proof: any = {
        description: data.proof_description,
      };
      if (proof_files)
        complainant_proof.images = await uploadAllFiles(proof_files);
      body.complainant_proof = complainant_proof;
    } else if (_id.equals(complain?.complain_against)) {
      let defendant_proof: any = {
        description: data.proof_description,
      };
      if (proof_files)
        defendant_proof.images = await uploadAllFiles(proof_files);
      body.defendant_proof = defendant_proof;
    } else {
      throw new BadRequestException(
        'Proofs must be added by Complainant or against person',
      );
    }
    // async function uploadFilesByOrder(files:any[]){
    //     let uploadedFilesArray = []
    //       for (let i = 0; i < proof_files.length; i++) {
    //           let item = proof_files[i];
    //           const temp = await this.uploadsService.uploadFile(item.buffer, Date.now()+ '-' + item.originalname  );
    //           uploadedFilesArray.push(temp.Location)
    //       }
    // }
    console.log(body);
    return await this.complaintsRepository.updateComplaint(
      { _id: new ObjectId(complain_id) },
      body,
    );
  }

  async update(id: string, updateComplaintDto: UpdateComplaintDto) {
    let complaint = await this.complaintsRepository.findComplaintById(id);
    if (!complaint)
      throw new BadRequestException(`Complain of Id ${id} Not Exists`);
    return await this.complaintsRepository.updateComplaint(
      { _id: new ObjectId(id) },
      updateComplaintDto,
    );
  }

  async remove(id: string) {
    return await this.complaintsRepository.deleteComplaint(id);
  }
}
