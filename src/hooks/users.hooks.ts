import EventEmitter from "node:events";
import { USER_HOOK_ACTIONS } from "../utils/constants/hooks.actions";
import sendMail from "../utils/mails/mails.sender";
import MAIL_ACTIONS from "../utils/constants/mail.actions";

const UsersHooks = new EventEmitter();

UsersHooks.on(
  USER_HOOK_ACTIONS.FORGOT_PWD,
  ({ receiver, otp }: { receiver: string; otp: string | number }) => {
    sendMail(MAIL_ACTIONS.OTP_CODE, receiver, otp);
  }
);

export default UsersHooks;
