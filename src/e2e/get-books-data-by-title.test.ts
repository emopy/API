import * as request from 'supertest';
import { Response } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Constants } from '../common/constants';
import { TestUtils } from '../common/utils/test-utils';
import { PrismaService } from '../database/prisma.service';
import { BookModule } from '../modules/book/book.module';
import { random } from 'faker';
import { compileTestingApplication, createAccessToken } from './helpers';

describe(`GET ${Constants.ENDPOINT.BOOK.DATA.GET_BY_TITLE}`, () => {
    let databaseService: PrismaService;
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        app = await compileTestingApplication([BookModule]);

        databaseService = await app.resolve(Constants.DEPENDENCY.DATABASE_SERVICE);

        const user = await TestUtils.createUserInDatabase(databaseService);

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
            response = await request(app.getHttpServer()).get(Constants.ENDPOINT.BOOK.DATA.GET_BY_TITLE);
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
            response = await request(app.getHttpServer())
                .get(Constants.ENDPOINT.BOOK.DATA.GET_BY_TITLE.replace(':title', random.alphaNumeric(40)))
                .set({ authorization: token });
        });

        it('Should return status code 400', () => {
            expect(response.status).toEqual(400);
        });

        it(`Should return error id ${Constants.EXCEPTION.INVALID_INPUT}`, () => {
            expect(response.body.error.id).toEqual(Constants.EXCEPTION.INVALID_INPUT);
        });
    });

    describe('When books associated with the provided title exist', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer())
                .get(Constants.ENDPOINT.BOOK.DATA.GET_BY_TITLE.replace(':title', 'flowers'))
                .set({ authorization: token });
        });

        it('Should return status code 200', () => {
            expect(response.status).toEqual(200);
        });

        it(`Should return an array with the books data`, () => {
            expect(response.body.length).toEqual(3);
        });
    });

    describe('When books associated with the provided title do not exist', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer())
                .get(Constants.ENDPOINT.BOOK.DATA.GET_BY_TITLE.replace(':title', 'fajoughashogj'))
                .set({ authorization: token });
        });

        it('Should return status code 200', () => {
            expect(response.status).toEqual(200);
        });

        it(`Should return an empty array`, () => {
            expect(response.body.length).toEqual(0);
        });
    });
});
