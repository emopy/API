import * as request from 'supertest';
import { Response } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { BookRequest, User } from '@prisma/client';
import { Constants } from '../common/constants';
import { TestUtils } from '../common/utils/test-utils';
import { PrismaService } from '../database/prisma.service';
import { BookModule } from '../modules/book/book.module';
import { random } from 'faker';
import { compileTestingApplication, createAccessToken } from './helpers';

describe(`POST ${Constants.ENDPOINT.BOOK.EXCHANGE.DECLINE}`, () => {
    let databaseService: PrismaService;
    let app: INestApplication;
    let token: string;
    let user: User;

    beforeAll(async () => {
        app = await compileTestingApplication([BookModule]);

        databaseService = await app.resolve(Constants.DEPENDENCY.DATABASE_SERVICE);

        user = await TestUtils.createUserInDatabase(databaseService);

        token = await createAccessToken(app, user);
    });

    afterAll(async () => {
        await TestUtils.dropDatabase(databaseService);

        await TestUtils.closeDatabase(databaseService);

        await app.close();
    });

    describe('When the user is not authorized', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer()).post(Constants.ENDPOINT.BOOK.EXCHANGE.DECLINE);
        });

        it('Should return status code 401', () => {
            expect(response.status).toEqual(401);
        });

        it(`Should return error id ${Constants.EXCEPTION.UNAUTHORIZED}`, () => {
            expect(response.body.error.id).toEqual(Constants.EXCEPTION.UNAUTHORIZED);
        });
    });

    describe('When input is invalid', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer()).post(Constants.ENDPOINT.BOOK.EXCHANGE.DECLINE).set({ authorization: token });
        });

        it('Should return status code 400', () => {
            expect(response.status).toEqual(400);
        });

        it(`Should return error id ${Constants.EXCEPTION.INVALID_INPUT}`, () => {
            expect(response.body.error.id).toEqual(Constants.EXCEPTION.INVALID_INPUT);
        });
    });

    describe('When the book request does not exist', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer())
                .post(Constants.ENDPOINT.BOOK.EXCHANGE.DECLINE)
                .send({ id: random.uuid() })
                .set({ authorization: token });
        });

        it('Should return status code 400', () => {
            expect(response.status).toEqual(400);
        });

        it(`Should return error id ${Constants.EXCEPTION.INVALID_REQUEST}`, () => {
            expect(response.body.error.id).toEqual(Constants.EXCEPTION.INVALID_REQUEST);
        });
    });

    describe('When the user does not own the book', () => {
        let response: Response;

        beforeAll(async () => {
            const tempUser = await TestUtils.createUserInDatabase(databaseService);
            const book = await TestUtils.createBookInDatabase(databaseService, tempUser.id);
            const bookRequest = await databaseService.bookRequest.create({ data: { userId: tempUser.id, bookId: book.id } });

            response = await request(app.getHttpServer())
                .post(Constants.ENDPOINT.BOOK.EXCHANGE.DECLINE)
                .send({ id: bookRequest.id })
                .set({ authorization: token });
        });

        it('Should return status code 400', () => {
            expect(response.status).toEqual(400);
        });

        it(`Should return error id ${Constants.EXCEPTION.INVALID_REQUEST}`, () => {
            expect(response.body.error.id).toEqual(Constants.EXCEPTION.INVALID_REQUEST);
        });
    });

    describe('When the input is valid', () => {
        let response: Response;
        let foundBookRequest: BookRequest;

        beforeAll(async () => {
            const book = await TestUtils.createBookInDatabase(databaseService, user.id);
            const tempUser = await TestUtils.createUserInDatabase(databaseService);
            const bookRequest = await databaseService.bookRequest.create({ data: { userId: tempUser.id, bookId: book.id } });

            response = await request(app.getHttpServer())
                .post(Constants.ENDPOINT.BOOK.EXCHANGE.DECLINE)
                .send({ id: bookRequest.id })
                .set({ authorization: token });

            foundBookRequest = await databaseService.bookRequest.findFirst({ where: { userId: user.id, bookId: book.id } });
        });

        it('Should return status code 204', () => {
            expect(response.status).toEqual(204);
        });

        it('Should delete the book request from the database', () => {
            expect(foundBookRequest).toBeNull();
        });
    });
});
