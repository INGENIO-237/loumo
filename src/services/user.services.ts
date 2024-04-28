import { Service } from "typedi";
import UserRepository from "../repositories/user.repository";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schemas";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";
import hashPassword from "../utils/hash-pwd";
import { UserDocument } from "../models/user.model";
import COMMON_MSG from "../utils/constants/common.msgs";
import { UsersHooks } from "../hooks";
import { USER_HOOK_ACTIONS } from "../utils/constants/hooks.actions";

@Service()
export default class UserService {
  constructor(private repository: UserRepository) {}

  async getUsers() {
    return await this.repository.getUsers();
  }

  async getUser({
    id,
    email,
    phone,
    throwExpection = true,
  }: {
    id?: string;
    email?: string;
    phone?: string;
    throwExpection?: boolean;
  }) {
    const user = await this.repository.getUser({ id, email, phone });

    if (throwExpection) {
      if (!user) {
        if (email) {
          throw new ApiError("Unregistered email address", HTTP.NOT_FOUND);
        } else {
          throw new ApiError("User Not Found", HTTP.NOT_FOUND);
        }
      }
    }

    return user;
  }

  async createUser(user: CreateUserInput["body"]) {
    const existingUser = await this.getUser({
      email: user.email,
      throwExpection: false,
    });

    if (existingUser)
      throw new ApiError("Email address already in use", HTTP.BAD_REQUEST);

    return await this.repository.createUser(user);
  }

  async updateUser(
    userId: string,
    user:
      | UpdateUserInput["body"]
      | (UpdateUserInput["body"] & {
          isVerified?: boolean;
          otp?: number;
          hasBeenDeleted?: boolean;
        })
  ) {
    const currentUser = (await this.getUser({ id: userId })) as UserDocument;

    // Make sure email is unique
    if (user.email) {
      const existingUser = await this.getUser({
        email: user.email,
        throwExpection: false,
      });

      if (existingUser && existingUser.email !== currentUser.email)
        throw new ApiError(COMMON_MSG.inUse("Email address"), HTTP.BAD_REQUEST);
    }

    // Make sure phone number is unique
    if (user.phone) {
      const existingPhoneNumber = await this.getUser({
        phone: user.phone,
        throwExpection: false,
      });

      if (existingPhoneNumber && currentUser._id != existingPhoneNumber._id)
        throw new ApiError(COMMON_MSG.inUse("Phone number"), HTTP.BAD_REQUEST);
    }

    if (user.password)
      user.password = await hashPassword(user.password as string);

    await this.repository.updateUser(userId, user);
  }

  async becomeMerchant(userId: string) {
    await this.repository.becomeMerchant(userId);
  }

  async deleteMyAccount(userId: string){
    UsersHooks.emit(USER_HOOK_ACTIONS.SOFT_DELETE_ACCOUNT, (userId));
  }
}
