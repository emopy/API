import { object, string } from 'joi';

export const PasswordResetValidationSchema = object({
    email: string().min(3).max(64).email().required(),
    password: string().min(3).max(64).required(),
    code: string().length(6).required(),
});
