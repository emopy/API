import { DotenvParseOutput, parse } from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';

class ConfigManager {
    private readonly _environmentalConfig = process.env;
    private readonly _fileConfig: DotenvParseOutput;

    constructor(fileConfig?: DotenvParseOutput) {
        if (fileConfig) {
            this._fileConfig = fileConfig;
            return;
        }

        this._fileConfig = this._loadFileConfig();
    }

    public get config() {
        return {
            APP: {
                MODE: this._getVariable('NODE_ENV'),
                PREFIX: this._getVariable('APP_PREFIX') || '/',
                PORT: parseInt(this._getVariable('PORT') || this._getVariable('APP_PORT'))
            },
            AUTH: {
                ACCESS_TOKEN_SECRET: this._getVariable('AUTH_ACCESS_TOKEN_SECRET'),
                GOOGLE_BOOKS_API_KEY: this._getVariable('AUTH_GOOGLE_BOOKS_API_KEY')
            },
            CLOUDINARY: {
                CLOUD_NAME: this._getVariable('CLOUDINARY_CLOUD_NAME'),
                API_KEY: this._getVariable('CLOUDINARY_API_KEY'),
                API_SECRET: this._getVariable('CLOUDINARY_API_SECRET')
            },
            DATABASE: {
                URL: this._getVariable('DATABASE_URL')
            },
            MAIL: {
                CLIENT_ID: this._getVariable('MAIL_CLIENT_ID'),
                CLIENT_SECRET: this._getVariable('MAIL_CLIENT_SECRET'),
                REFRESH_TOKEN: this._getVariable('MAIL_REFRESH_TOKEN'),
                USER: this._getVariable('MAIL_USER')
            },
            REDIS: {
                HOST: this._getVariable('REDIS_HOST'),
                PORT: parseInt(this._getVariable('REDIS_PORT'))
            }
        } as const;
    }

    private _getVariable(name: string): string {
        if (!this._fileConfig || !this._fileConfig[name.toString()]) {
            return this._environmentalConfig[name.toString()];
        }

        return this._fileConfig[name.toString()];
    }

    private _loadFileConfig(): DotenvParseOutput {
        try {
            const path = join(__dirname, '../../../env', `${process.env.NODE_ENV || 'development'}.env`);
            return parse(readFileSync(path));
        } catch (error) {
            if (process.env.NODE_ENV === 'test' && process.env.CI !== 'true') {
                console.log('In order to run the tests, you need to specify the test.env file');
                process.exit(0);
            }

            console.log('File config not found. Skipping...');
        }
    }
}

export const Config = new ConfigManager().config;
