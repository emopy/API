import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { Constants } from '../../common/constants';
import { MailService } from './mail.service';
import { SendEmailConfirmationMailValidationSchema } from './schemas/send-email-confirmation-mail.schema';
import { SendPasswordResetMailValidationSchema } from './schemas/send-password-reset-mail.schema';
import { SendEmailConfirmationMailRequestDto } from './dto/send-email-confirmation-mail-request.dto';
import { SendPasswordResetMailRequestDto } from './dto/send-password-reset-mail-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('/')
export class MailController {
    constructor(private readonly _mailService: MailService) {}

    @Post(Constants.ENDPOINT.MAIL.EMAIL_CONFIRMATION)
    @HttpCode(Constants.STATUS_CODE.NO_CONTENT)
    public async sendAccountConfirmationMail(
        @Body(new ValidationPipe(SendEmailConfirmationMailValidationSchema)) body: SendEmailConfirmationMailRequestDto,
    ): Promise<void> {
        await this._mailService.sendEmailConfirmationMail(body);
    }

    @Post(Constants.ENDPOINT.MAIL.PASSWORD_RESET)
    @HttpCode(Constants.STATUS_CODE.NO_CONTENT)
    public async sendResetPasswordConfirmationMail(
        @Body(new ValidationPipe(SendPasswordResetMailValidationSchema)) body: SendPasswordResetMailRequestDto,
    ): Promise<void> {
        await this._mailService.sendPasswordResetMail(body);
    }
}
