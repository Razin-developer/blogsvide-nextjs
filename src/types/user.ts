import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profileImage?: string;
  role: 'user' | 'admin';
  socialProviderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFullUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  role: 'user' | 'admin';
  socialProviderId?: string;
  createdAt: Date;
  updatedAt: Date;
}
