import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(password:string): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name must be provided"],
      maxlength: 100,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide user's email address"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    password: {
      type: String,
      trim: false,
      required: [true, "Password must be provided"],
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password as string, salt);
});
UserSchema.method(
  "comparePassword",
  async function comparePassword(userPassword: string) {
    return await bcrypt.compare(userPassword, this.password);
  }
);

const User = mongoose.model<IUser, UserModel>("User", UserSchema);
export default User;
