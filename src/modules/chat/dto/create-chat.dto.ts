import { ObjectId } from "mongodb";

export class CreateChatDto {
    readonly _id?:string;
    readonly message:string;
    sender:ObjectId;
    to:ObjectId;
    conversationId?:ObjectId
    parcel?:String|ObjectId
}
