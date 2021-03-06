import * as cookieParser from 'cookie-parser';
import { internet, random } from 'faker';
import { Config } from '../config';
import { INestApplication } from '@nestjs/common';
import { ExceptionFilter } from '../filters/exception.filter';
import { TestingModule } from '@nestjs/testing';
import { Book, Genre, Language, PrismaClient, User } from '@prisma/client';
import { IUserCreateInput } from '../../database/types/IUserCreateInput';
import { ValidationPipe } from '../pipes/validation.pipe';
import { RedisService } from '../../modules/redis/redis.service';
import { IBookCreateInput } from '../../database/types/IBookCreateInput';

export class TestUtils {
    public static async dropDatabase(database: PrismaClient): Promise<void> {
        if (Config.APP.MODE !== 'test') {
            console.log('ERROR: You can drop database only in the testing environment');
        }

        await Promise.all([
            database.book.deleteMany(),
            database.bookData.deleteMany(),
            database.confirmationCode.deleteMany(),
            database.userReview.deleteMany(),
            database.bookReview.deleteMany(),
            database.user.deleteMany()
        ]);
    }

    public static async dropRedis(redisService: RedisService): Promise<void> {
        if (Config.APP.MODE !== 'test') {
            console.log('ERROR: You can drop redis only in the testing environment');
        }

        await redisService.clearCache();
    }

    public static async closeDatabase(database: PrismaClient): Promise<void> {
        await database.$disconnect();
    }

    public static generateFakeUserData(): IUserCreateInput {
        return {
            email: internet.email(),
            password: internet.password()
        };
    }

    public static generateFakeBookData(userId: string): IBookCreateInput {
        return {
            isbn: random.alphaNumeric(13),
            title: random.word(),
            description: random.word(),
            image: random.word(),
            genre: random.arrayElement(Object.values(Genre)),
            language: random.arrayElement(Object.values(Language)),
            latitude: random.number({ min: -90, max: 90 }),
            longitude: random.number({ min: -180, max: 180 }),
            ownerId: userId
        };
    }

    public static async createUserInDatabase(database: PrismaClient): Promise<User> {
        return await database.user.create({
            data: {
                ...this.generateFakeUserData(),
                latitude: random.number({ min: -90, max: 90 }),
                longitude: random.number({ min: -180, max: 180 })
            }
        });
    }

    public static async createBookInDatabase(database: PrismaClient, userId: string): Promise<Book> {
        return await database.book.create({ data: this.generateFakeBookData(userId) });
    }

    public static async createTestApplication(module: TestingModule): Promise<INestApplication> {
        const app = module.createNestApplication();

        app.useGlobalFilters(new ExceptionFilter());
        app.useGlobalPipes(new ValidationPipe());
        app.use(cookieParser());

        await app.init();

        return app;
    }
}
