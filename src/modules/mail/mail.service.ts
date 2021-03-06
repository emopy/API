import { Inject, Injectable } from '@nestjs/common';
import { Constants } from '../../common/constants';
import { generateConfirmationCode } from '../../common/helpers/generate-confirmation-code';
import { PrismaService } from '../../database/prisma.service';
import { IEmailService } from '../email/types/IEmailService';
import { EmailConfirmationMail } from '../email/mails/email-confirmation-mail';
import { PasswordResetMail } from '../email/mails/password-reset-mail';
import { SendEmailConfirmationMailBodyDto } from './dto/send-email-confirmation-mail-body.dto';
import { SendPasswordResetMailBodyDto } from './dto/send-password-reset-mail-body.dto';
import { ValidationService } from '../validation/validation.service';

@Injectable()
export class MailService {
    constructor(
        @Inject(Constants.DEPENDENCY.DATABASE_SERVICE) private readonly _databaseService: PrismaService,
        @Inject(Constants.DEPENDENCY.EMAIL_SERVICE) private readonly _emailService: IEmailService,
        @Inject(Constants.DEPENDENCY.VALIDATION_SERVICE) private readonly _validationService: ValidationService
    ) {}

    public async sendEmailConfirmationMail(body: SendEmailConfirmationMailBodyDto): Promise<void> {
        const user = await this._databaseService.user.findUnique({ where: { email: body.email }, select: { accountType: true, isConfirmed: true, id: true } });

        this._validationService.user.throwIfUserHasSocialMediaAccount(user);

        this._validationService.user.throwIfAccountIsAlreadyConfirmed(user);

        const confirmationCode = generateConfirmationCode();

        await this._databaseService.confirmationCode.create({ data: { ...confirmationCode, userId: user.id }, select: null });

        await this._emailService.sendMail(new EmailConfirmationMail(body.email, { code: confirmationCode.code }));
    }

    public async sendPasswordResetMail(body: SendPasswordResetMailBodyDto): Promise<void> {
        const user = await this._databaseService.user.findUnique({ where: { email: body.email }, select: { accountType: true, isConfirmed: true, id: true } });

        this._validationService.user.throwIfUserHasSocialMediaAccount(user);

        this._validationService.user.throwIfAccountIsNotConfirmed(user);

        const confirmationCode = generateConfirmationCode();

        await this._databaseService.confirmationCode.create({ data: { ...confirmationCode, userId: user.id }, select: null });

        await this._emailService.sendMail(new PasswordResetMail(body.email, { code: confirmationCode.code }));
    }
}
