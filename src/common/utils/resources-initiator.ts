import { Application } from 'express';
import config from '../../config';
import { ConfigValidator } from './config-validator';
import { Database } from './database';
import { logger } from './logger';
import routers from '../../routes';
import cors from 'cors';

export class ResourcesInitiator {
    public static async init(app: Application): Promise<void> {
        await ConfigValidator.validate(config);

        this._initiateExceptionListeners();
        
        app.use(cors({ credentials: true, origin: true }));

        await this._initiateProviders();

        this._renderRoutes(app);
    }

    private static _initiateExceptionListeners(): void {
        process.on('uncaughtException', (error) => {
            logger.red(error.message);
            process.exit(1);
        });

        process.on('unhandledRejection', (error) => {
            logger.red(error as string);
        });
    }

    private static async _initiateProviders(): Promise<void> {
        await new Database(config.DATABASE.URL, config.DATABASE.NAME).connect();
    }

    private static _renderRoutes(app: Application): void {
        Object.values(routers).forEach(router => app.use(config.APP.PREFIX, router.getRouter()));
    }
}