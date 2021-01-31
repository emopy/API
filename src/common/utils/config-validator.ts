import { object, string, number } from 'joi';
import { Config } from '../config';
import { Constants } from '../constants';
import { Logger } from './logger';

export class ConfigValidator {
    public static async validate(config: typeof Config): Promise<void> {
        try {
            const schema = this._getValidationSchema();
            await schema.validateAsync(config);
        } catch (error) {
            this._printErrorMessageAndExit(error.message);
        }
    }

    private static _getValidationSchema() {
        return object({
            APP: {
                MODE: string().valid(Constants.APP_MODE.DEV, Constants.APP_MODE.PROD, Constants.APP_MODE.TEST),
                PREFIX: string(),
                PORT: number().min(1).max(65353),
            },
            AUTH: {
                ACCESS_TOKEN_SECRET: string().min(16),
            },
            CLOUDINARY: {
                CLOUD_NAME: string().required(),
                API_KEY: string().required(),
                API_SECRET: string().required(),
            },
            DATABASE: {
                URL: string().required(),
                TEST_URL: string().required(),
            },
            MAIL: {
                CLIENT_ID: string().required(),
                CLIENT_SECRET: string().required(),
                REFRESH_TOKEN: string().required(),
                USER: string().email(),
            },
        });
    }

    private static _printErrorMessageAndExit(message: string): void {
        Logger.error(`Environmental variable error - ${message}`);
        process.exit(1);
    }
}
