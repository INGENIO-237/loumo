import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";

type Phone = {
  country: {
    code: number;
    name: string;
    shortName: string;
  };
  value: number;
};

type ShippingAddress = {
  street: string;
  city: string;
  country: string;
};

export interface UserDocument extends Document {
  email: string;
  phone?: Phone;
  password: string;
  isVerified: boolean;
  otp: number;
  shippingAddresses?: ShippingAddress[] | [];
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
      type: {
        country: {
          code: Number,
          name: String,
          shortName: String,
        },
        value: Number,
      },
      index: { unique: true, sparse: true },
    },
    password: {
      type: String,
      required: true,
    },
    shippingAddresses: {
      type: [
        {
          street: String,
          city: String,
          country: String,
        },
      ],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: Number,
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
