import { Document, Schema, model } from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User