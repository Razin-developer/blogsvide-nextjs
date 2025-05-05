import { Types } from "mongoose";
import { IUser } from "./user";

export interface IBlog {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  description: string;
  comments: {
    user: IUser | string;
    _id: Types.ObjectId
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  image: string;
  user: IUser | string;
  createdAt: Date;
  updatedAt: Date;
}