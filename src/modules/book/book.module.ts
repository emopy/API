import { Module } from '@nestjs/common';
import { GoogleApiModule } from './api/google-api.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TokenGuardModule } from '../../common/guards/token.guard.module';
import { PrismaService } from '../../database/prisma.service';
import { EmailModule } from '../email/email.module';
import { ValidationModule } from '../validation/validation.module';

@Module({
    imports: [GoogleApiModule, TokenGuardModule, EmailModule, ValidationModule],
    providers: [BookService, PrismaService],
    controllers: [BookController],
    exports: [BookService]
})
export class BookModule {}
