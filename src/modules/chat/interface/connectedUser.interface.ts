import { ObjectId } from "mongodb";

export default interface ConnectedUser{
    readonly _id:ObjectId
    readonly first_name?:string;
    readonly last_name?:string;
    readonly name?:string;
    readonly avatar:string;
    readonly socketId:string;
    readonly phone:string;
    readonly email:string;
}