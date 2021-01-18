export const Endpoint = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGIN_GOOGLE: '/auth/login-google',
        LOGIN_FACEBOOK: '/auth/login-facebook',
        LOGOUT: '/auth/logout'
    },
    ACCOUNT: {
        CHANGE_PASSWORD: '/account/change-password',
        CONFIRM_EMAIL: '/account/confirm-email',
        RESET_PASSWORD: '/account/reset-password',
        SEND_ACCOUNT_CONFIRMATION_MAIL: '/account/send-account-confirmation-mail',
        SEND_RESET_PASSWORD_CONFIRMATION_MAIL: '/account/send-reset-password-confirmation-mail'
    }
} as const;