import { random, internet } from 'faker';
import { testConfig } from './helpers';

describe('Config validator - validate method', () => {
    const config = {
        APP: {
            MODE: 'test',
            PREFIX: 'api/v1/',
            PORT: 4000
        },
        AUTH: {
            ACCESS_TOKEN_SECRET: random.alphaNumeric(48),
            GOOGLE_BOOKS_API_KEY: random.alphaNumeric(48)
        },
        CLOUDINARY: {
            CLOUD_NAME: random.alphaNumeric(10),
            API_KEY: random.alphaNumeric(10),
            API_SECRET: random.alphaNumeric(10)
        },
        DATABASE: {
            URL: 'mongodb://'
        },
        MAIL: {
            CLIENT_ID: random.alphaNumeric(10),
            CLIENT_SECRET: random.alphaNumeric(10),
            REFRESH_TOKEN: random.alphaNumeric(10),
            USER: internet.email()
        },
        REDIS: {
            HOST: random.alphaNumeric(10),
            PORT: 4000
        }
    };

    describe('When APP.MODE is invalid', () => {
        beforeAll(() => {
            config.APP.MODE = random.word();
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.APP.MODE = 'test';
            jest.clearAllMocks();
        });
    });

    describe('When APP.PREFIX is invalid', () => {
        beforeAll(() => {
            //@ts-expect-error
            config.APP.PREFIX = random.number();
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.APP.PREFIX = '/api/v1';
            jest.clearAllMocks();
        });
    });

    describe('When APP.PORT is invalid', () => {
        beforeAll(() => {
            config.APP.PORT = 0;
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.APP.PORT = 4000;
            jest.clearAllMocks();
        });
    });

    describe('When AUTH.ACCESS_TOKEN_SECRET is invalid', () => {
        beforeAll(() => {
            config.AUTH.ACCESS_TOKEN_SECRET = random.alphaNumeric(8);
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.AUTH.ACCESS_TOKEN_SECRET = random.alphaNumeric(64);
            jest.clearAllMocks();
        });
    });

    describe('When AUTH.GOOGLE_BOOKS_API_KEY is invalid', () => {
        beforeAll(() => {
            config.AUTH.GOOGLE_BOOKS_API_KEY = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.AUTH.GOOGLE_BOOKS_API_KEY = random.alphaNumeric(64);
            jest.clearAllMocks();
        });
    });

    describe('When CLOUDINARY.CLOUD_NAME is invalid', () => {
        beforeAll(() => {
            config.CLOUDINARY.CLOUD_NAME = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.CLOUDINARY.CLOUD_NAME = random.alphaNumeric(10);
            jest.clearAllMocks();
        });
    });

    describe('When CLOUDINARY.API_KEY is invalid', () => {
        beforeAll(() => {
            config.CLOUDINARY.API_KEY = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.CLOUDINARY.API_KEY = random.alphaNumeric(10);
            jest.clearAllMocks();
        });
    });

    describe('When CLOUDINARY.API_SECRET is invalid', () => {
        beforeAll(() => {
            config.CLOUDINARY.API_SECRET = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.CLOUDINARY.API_SECRET = random.alphaNumeric(10);
            jest.clearAllMocks();
        });
    });

    describe('When DATABASE.URL is invalid', () => {
        beforeAll(() => {
            config.DATABASE.URL = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.DATABASE.URL = 'mongodb://';
            jest.clearAllMocks();
        });
    });

    describe('When MAIL.CLIENT_ID is invalid', () => {
        beforeAll(() => {
            config.MAIL.CLIENT_ID = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.MAIL.CLIENT_ID = random.alphaNumeric(10);
            jest.clearAllMocks();
        });
    });

    describe('When MAIL.CLIENT_SECRET is invalid', () => {
        beforeAll(() => {
            config.MAIL.CLIENT_SECRET = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.MAIL.CLIENT_SECRET = random.alphaNumeric(10);
            jest.clearAllMocks();
        });
    });

    describe('When MAIL.REFRESH_TOKEN is invalid', () => {
        beforeAll(() => {
            config.MAIL.REFRESH_TOKEN = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.MAIL.REFRESH_TOKEN = random.alphaNumeric(10);
            jest.clearAllMocks();
        });
    });

    describe('When MAIL.USER is invalid', () => {
        beforeAll(() => {
            config.MAIL.USER = random.alphaNumeric(10);
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.MAIL.USER = internet.email();
            jest.clearAllMocks();
        });
    });

    describe('When REDIS.HOST is invalid', () => {
        beforeAll(() => {
            config.REDIS.HOST = '';
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.REDIS.HOST = random.alphaNumeric(10);
            jest.clearAllMocks();
        });
    });

    describe('When REDIS.PORT is invalid', () => {
        beforeAll(() => {
            config.REDIS.PORT = 0;
        });

        it('Should call process.exit with code 1', async () => {
            await testConfig(config);
        });

        afterAll(() => {
            config.REDIS.PORT = 4000;
            jest.clearAllMocks();
        });
    });

    describe('When all variables are valid', () => {
        it('Should not call process.exit', async () => {
            await testConfig(config, false);
        });
    });
});
