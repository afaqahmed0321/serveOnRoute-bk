import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { ROLE } from '@enums/role.enum';
import { classToPlain, Exclude } from 'class-transformer';
const moment = require('moment');
import * as paginate from 'mongoose-paginate-v2';
import { STATUS } from '@/enums/status.enum';
// import {paginate} from '@helpers/paginate'

export type UserDocument = User & Document;

@Schema({ 
  collection: 'users',
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({
    type: ObjectId,
    default: () => {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    optional: true,
    index: true,
    type: String,
  })
  name: string;

  @Prop({
    index: true,
    type: String,
    default: '',
  })
  first_name: string;

  @Prop({
    index: true,
    type: String,
    default: '',
  })
  last_name: string;

  @Prop({
    optional: true,
    type: String,
  })
  email: string;

  @Prop({
    index: true,
    type: String,
  })
  gender: string;

  @Prop({
    index: true,
    type: String,
  })
  age: string;

  @Prop({
    type: String,
    default: '',
  })
  country: string;

  @Prop({
    type: String,
    default: '',
  })
  city: string;

  @Prop({
    type: String,
    default: '',
  })
  address?: string;

  @Prop({
    type: String,
    default:''
  })
  ID?: string;

  @Prop({
    type: String,
    default:''
  })
  license_id?: string;

  @Prop({
    type: String,
    default:''
  })
  car_name?: string;

  @Prop({
    type: String,
    default:''
  })
  car_picture?: string;
  
  @Prop({
    type: [String],
    default:''
  })
  ID_file?: [string];

  @Prop({
    type: String,
    default:''
  })
  vehicle_no?: string;
  
  @Prop({
    type: [String],
    default:''
  })
  driving_license?: [string];

  @Prop({
    type:String
  })
  driving_license_expiry?:string;

  @Prop({
    type: String,
    default:''
  })
  phone: string;

  @Exclude({ toPlainOnly: true })
  @Prop({
    required: true,
    type: String,
    private: true,
  })
  password?: string;

  @Prop({
    index: true,
    type: String,
    default:
      '	https://static.vecteezy.com/system/resources/previ…/487/917/original/man-avatar-icon-free-vector.jpg',
  })
  avatar?: string;

  @Prop({
    index: true,
    type: String,
    default:
      '	https://www.shutterstock.com/image-vector/motorcyc…rider-icon-design-creativity-260nw-1285907485.jpg',
  })
  cover_image?: string;

  @Prop({
    type:Boolean,
    default:false
  })
  isVerified?: boolean

  @Prop({
    type:Boolean,
    default:function(){
      if(this.role.includes('rider')){
        return false
      }else{
        return true;
      }
    }
  })
  isApproved?: boolean


  @Prop({ type: Array, enum: ROLE, default: [ROLE.NORMAL_USER] })
  role: [ROLE];

  @Prop({ type: Boolean, default: false })
  is_block?: boolean;

  @Prop({ type: String })
  block_proof_description?: string;

  @Prop({ type: String })
  block_proof_image?: string;

  @Prop({
    type: Boolean,
    default: false,
    index: true,
  })
  isLoggedIn?: boolean;

  @Prop({
    type: String,
  })
  accessToken?: string;

  @Prop({
    type:Number,
  })
  ranking?:Number

  @Prop({
    type:String,
    default:'0'
  })
  total_earning?:string

  @Prop({
    type:String
  })
  account?:string

  @Prop({
    type:Boolean,
    default:false
  })
  account_linked?:boolean

  @Prop({
    type:String
  })
  customerId?:string

  @Prop({
    type: Number,
    default: false,
    index: true,
  })
  rating?: number;

  @Prop({
    type:Number,
  })
  total_rides?:number

  @Prop({
    type:String,
    default:function(){
      if(this.role.includes("user")){
        return STATUS.ACTIVE
      }else{
        return STATUS.INACTIVE
      }
    }
  })
  status?:string

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(paginate);
