/* eslint-disable prettier/prettier */

export interface User {
    id: string;
    mail: string;
    avatar: string;
    username: string;
    isEnable2fa: boolean;
    accessToken: string;
    refreshToken: string;
    created_at: Date;
    updated_at: Date;
    isOnboarding: boolean;
}