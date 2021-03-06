import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class ResetPasswordBodyDto implements Readonly<ResetPasswordBodyDto> {
    @ApiProperty({ minLength: 3, maxLength: 64 })
    @IsString()
    @MinLength(3)
    @MaxLength(64)
    @IsEmail()
    public email: string;

    @ApiProperty({ minLength: 3, maxLength: 64 })
    @IsString()
    @MinLength(3)
    @MaxLength(64)
    public password: string;

    @ApiProperty({ minLength: 6, maxLength: 6 })
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    public code: string;
}
