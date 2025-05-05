import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: "user" },
  profileImage: { type: String, default: "/default/default.png" },
  socialProviderId: { type: String },
}, { timestamps: true })

export const User = models?.User || model('User', userSchema);

