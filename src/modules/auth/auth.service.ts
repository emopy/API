import { Inject, Injectable } from '@nestjs/common';
import { Constants } from '../../common/constants';
import { InvalidCredentialsException } from '../../common/exceptions/invalid-credentials.exception';
import { generateConfirmationCode } from '../../common/helpers/generate-confirmation-code';
import { PrismaService } from '../../database/prisma.service';
import { IEmailService } from '../email/types/IEmailService';
import { EmailConfirmationMail } from '../email/mails/email-confirmation-mail';
import { IHashService } from '../hash/types/IHashService';
import { ITokenService } from '../token/types/ITokenService';
import { AccessToken } from '../token/tokens/access-token';
import { ValidationService } from '../validation/validation.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { RegisterBodyDto } from './dto/register-body.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(Constants.DEPENDENCY.DATABASE_SERVICE) private readonly _databaseService: PrismaService,
        @Inject(Constants.DEPENDENCY.TOKEN_SERVICE) private readonly _tokenService: ITokenService,
        @Inject(Constants.DEPENDENCY.VALIDATION_SERVICE) private readonly _validationService: ValidationService,
        @Inject(Constants.DEPENDENCY.HASH_SERVICE) private readonly _hashService: IHashService,
        @Inject(Constants.DEPENDENCY.EMAIL_SERVICE) private readonly _emailService: IEmailService
    ) {}

    public async register(body: RegisterBodyDto): Promise<void> {
        await this._validationService.throwIfEmailAlreadyExists(body.email);

        const hashedPassword = await this._hashService.generateHash(body.password);

        const user = await this._databaseService.user.create({ data: { ...body, password: hashedPassword } });

        const confirmationCode = generateConfirmationCode();

        await this._databaseService.confirmationCode.create({ data: { ...confirmationCode, userId: user.id } });

        await this._emailService.sendMail(new EmailConfirmationMail(user.email, { code: confirmationCode.code }));
    }

    public async login(body: LoginBodyDto): Promise<LoginResponseDto> {
        const user = await this._validationService.getUserByEmailOrThrow(body.email, new InvalidCredentialsException());

        this._validationService.throwIfUserHasSocialMediaAccount(user);

        await this._validationService.throwIfPasswordIsInvalid(user, body.password);

        this._validationService.throwIfAccountIsNotConfirmed(user);

        const token = await this._tokenService.generate(
            new AccessToken({
                id: user.id,
                email: user.email,
                version: user.tokenVersion
            })
        );

        return { token };
    }

    public async logout(id: string, tokenVersion: number): Promise<void> {
        await this._databaseService.user.update({ where: { id }, data: { tokenVersion: tokenVersion + 1 } });
    }
}