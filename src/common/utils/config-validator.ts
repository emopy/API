import { object, string, number } from 'joi';
import config from '../../config';
import { Constants } from '../constants';
import { logger } from './logger';

export class ConfigValidator {
    public static async validate(): Promise<boolean> {
        try {
            const validationSchema = this._getValidationSchema();
            await validationSchema.validateAsync(config);

            return true;
        } catch(error) {
            this._printErrorMessage(error.message);
            return false;
        }
    }
    
    private static _getValidationSchema() {
        return object({
            APP: {
                MODE: string().valid(Constants.AppMode.DEV, Constants.AppMode.PROD, Constants.AppMode.TEST),
                PREFIX: string(),
                PORT: number().required()
            }
        });
    }
    
    private static _printErrorMessage(message: string): void {
        logger.red(`Environment variable error: ${message}`);
    }
}