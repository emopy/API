import { Constants } from "../constants";
import { BaseException } from "./base.exception";

export class InvalidConfirmationCodeException extends BaseException {
    id = Constants.EXCEPTION.INVALID_CONFIRMATION_CODE;
    statusCode = Constants.EXCEPTION.UNAUTHORIZED;
    message = 'Provided confirmation code is invalid'
}