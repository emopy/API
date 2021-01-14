import { Constants } from '../../common/constants';
import { Router } from '../../common/utils/router';
import { AuthController } from './auth.controller';
import { injectable, inject } from 'inversify';
import { validateBody } from '../../common/middlewares/validate-body.middleware';
import { RegisterValidationSchema } from './schemes/register.schema';

@injectable()
export class AuthRouter extends Router {
    constructor(@inject(Constants.DEPENDENCY.AUTH_CONTROLLER) private readonly _authController: AuthController) {
        super();

        this._router.post(Constants.ENDPOINT.AUTH.REGISTER, validateBody(RegisterValidationSchema), this._authController.register);
    }
}