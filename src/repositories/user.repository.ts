import { Service } from "typedi";
import User, { UserDocument } from "../models/user.model";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schemas";

@Service()
export default class UserRepository {
  async getUsers() {
    return await User.find().select("-password -__v");
  }

  async getUser({ id, email }: { id?: string; email?: string }) {
    return id
      ? await User.findOne<UserDocument>({ _id: id })
      : email
      ? await User.findOne<UserDocument>({ email })
      : null;
  }

  async createUser(user: CreateUserInput["body"]) {
    return User.create(user).then(async (createdUser) => {
      const user = await User.findById(createdUser._id.toString()).select(
        "-password -__v"
      );

      return user;
    });
  }

  async updateUser(
    userId: string,
    user:
      | UpdateUserInput["body"]
      | (UpdateUserInput["body"] & { isVerified?: boolean; otp?: number })
  ) {
    await User.findByIdAndUpdate(userId, user);
  }
}
