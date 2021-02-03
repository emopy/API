import { Body, Controller, HttpCode, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Constants } from '../../common/constants';
import { Request } from 'express';
import { UserService } from './user.service';
import { TokenGuard } from '../../common/guards/token.guard';
import { IFile } from '../../services/file/interfaces/IFile';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { ConfirmEmailValidationSchema } from './schemas/confirm-email.schema';
import { ConfirmEmailRequestDto } from './dto/confirm-email-request.dto';
import { ResetPasswordValidationSchema } from './schemas/reset-password.schema';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';

@Controller('/')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Put(Constants.ENDPOINT.USER.AVATAR.UPDATE)
    @HttpCode(Constants.STATUS_CODE.NO_CONTENT)
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(TokenGuard)
    public async updateAvatar(@Req() request: Request, @UploadedFile() image: IFile): Promise<void> {
        await this._userService.updateAvatar(image, request.user.id);
    }

    @Post(Constants.ENDPOINT.USER.EMAIL.CONFIRM)
    @HttpCode(Constants.STATUS_CODE.NO_CONTENT)
    public async confirmEmail(@Body(new ValidationPipe(ConfirmEmailValidationSchema)) body: ConfirmEmailRequestDto): Promise<void> {
        await this._userService.confirmEmail(body);
    }

    @Post(Constants.ENDPOINT.USER.PASSWORD.UPDATE)
    @HttpCode(Constants.STATUS_CODE.NO_CONTENT)
    public async resetPassword(@Body(new ValidationPipe(ResetPasswordValidationSchema)) body: ResetPasswordRequestDto): Promise<void> {
        await this._userService.resetPassword(body);
    }
}
