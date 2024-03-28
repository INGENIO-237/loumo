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
  shippingAddresses?: ShippingAddress[] | [];
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
      unique: true,
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

  if(!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.SALT_FACTOR);

  console.log({ salt });

  const hash = await bcrypt.hash(user.password, salt);

  console.log({ hash });

  user.password = hash;

  return next();
});

const User = model("User", userSchema);

export default User;
