import { ObjectId } from 'mongoose';

export default interface RequestUserInterface {
  readonly _id?: ObjectId;
  readonly username: string;
  readonly email: string;
  readonly phone: string;
  readonly user_id: string;
  readonly name: string;
  readonly role: string[];
  readonly customerId:string;
} 
