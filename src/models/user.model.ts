import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";

type ShippingAddress = {
  location: string;
  coords: {
    lat: number;
    lng: number;
  };
};

export interface UserDocument extends Document {
  email: string;
  phone?: number;
  password: string;
  isVerified: boolean;
  otp: number;
  shippingAddress?: ShippingAddress;
  isMerchant: boolean;
  hasBeenDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      index: { unique: true, sparse: true },
    },
    password: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: {
        location: String,
        coords: {
          lat: Number,
          lng: Number,
        },
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: Number,
    isMerchant: {
      type: Boolean,
      default: false,
    },
    hasBeenDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<UserDocument>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.SALT_FACTOR);

  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  const user = this as UserDocument;

  return await bcrypt
    .compare(candidate.trim(), user.password)
    .catch((e) => false);
};

const User = model<UserDocument>("User", userSchema);

export default User;
