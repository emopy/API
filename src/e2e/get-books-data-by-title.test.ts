import * as request from 'supertest';
import { Response } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Constants } from '../common/constants';
import { TestUtils } from '../common/utils/test-utils';
import { PrismaService } from '../database/prisma.service';
import { BookModule } from '../modules/book/book.module';
import { AccessToken } from '../modules/token/tokens/access-token';
import { ITokenService } from '../modules/token/types/ITokenService';

describe(`GET ${Constants.ENDPOINT.BOOK.GET_DATA_BY_TITLE}`, () => {
    let databaseService: PrismaService;
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [BookModule]
        }).compile();

        app = await TestUtils.createTestApplication(module);
        databaseService = await app.resolve(Constants.DEPENDENCY.DATABASE_SERVICE);

        const tokenService = (await app.resolve(Constants.DEPENDENCY.TOKEN_SERVICE)) as ITokenService;
        const user = await TestUtils.createUserInDatabase(databaseService);

        token = await tokenService.generate(new AccessToken({ id: user.id, email: user.email, version: user.tokenVersion }));
    });

    afterAll(async () => {
        await TestUtils.dropDatabase(databaseService);
        await app.close();
    });

    describe('When the user is not authorized', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer()).get(Constants.ENDPOINT.BOOK.GET_DATA_BY_TITLE);
        });

        it('Should return status code 401', () => {
            expect(response.status).toEqual(401);
        });

        it(`Should return errro id ${Constants.EXCEPTION.UNAUTHORIZED}`, () => {
            expect(response.body.error.id).toEqual(Constants.EXCEPTION.UNAUTHORIZED);
        });
    });

    describe('When books associated with the provided title exist', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer())
                .get(Constants.ENDPOINT.BOOK.GET_DATA_BY_TITLE.replace(':title', 'flowers'))
                .set({ authorization: token });
        });

        it('Should return status code 200', () => {
            expect(response.status).toEqual(200);
        });

        it(`Should return an array with the books data`, () => {
            expect(response.body.length).toEqual(3);

            expect(response.body[0].title).toEqual('Flowers');
            expect(response.body[1].title).toEqual('Pretty Flowers Easy Color Book');
            expect(response.body[2].title).toEqual('When the Flowers Died');
        });
    });

    describe('When books associated with the provided title do not exist', () => {
        let response: Response;

        beforeAll(async () => {
            response = await request(app.getHttpServer())
                .get(Constants.ENDPOINT.BOOK.GET_DATA_BY_TITLE.replace(':title', 'fajoughashogj'))
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
