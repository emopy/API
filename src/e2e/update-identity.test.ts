import * as request from 'supertest';
import { Response } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { User } from '@prisma/client';
import { Constants } from '../common/constants';
import { TestUtils } from '../common/utils/test-utils';
import { PrismaService } from '../database/prisma.service';
import { UserModule } from '../modules/user/user.module';
import { random } from 'faker';
import { compileTestingApplication, createAccessToken } from './helpers';

describe(`PUT ${Constants.ENDPOINT.USER.IDENTITY.UPDATE}`, () => {
    let databaseService: PrismaService;
    let app: INestApplication;
    let token: string;
    let user: User;

    beforeAll(async () => {
        app = await compileTestingApplication([UserModule]);

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
            response = await request(app.getHttpServer()).put(Constants.ENDPOINT.USER.IDENTITY.UPDATE);
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
            response = await request(app.getHttpServer()).put(Constants.ENDPOINT.USER.IDENTITY.UPDATE).set({ authorization: token });
        });

        it('Should return status code 400', () => {
            expect(response.status).toEqual(400);
        });

        it(`Should return error id ${Constants.EXCEPTION.INVALID_INPUT}`, () => {
            expect(response.body.error.id).toEqual(Constants.EXCEPTION.INVALID_INPUT);
        });
    });

    describe('When input is valid', () => {
        const fakeData = { firstName: random.alphaNumeric(10), lastName: random.alphaNumeric(10) };
        let response: Response;
        let updatedUser: User;

        beforeAll(async () => {
            response = await request(app.getHttpServer()).put(Constants.ENDPOINT.USER.IDENTITY.UPDATE).send(fakeData).set({ authorization: token });
            updatedUser = await databaseService.user.findUnique({ where: { id: user.id } });
        });

        it('Should return status code 204', () => {
            expect(response.status).toEqual(204);
        });

        it('Should update the data in the database', () => {
            expect(updatedUser.firstName).toEqual(fakeData.firstName);
            expect(updatedUser.lastName).toEqual(fakeData.lastName);
        });
    });
});
