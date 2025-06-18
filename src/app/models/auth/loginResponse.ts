export interface LoginResponse {
    isSuccess: boolean;
    message: string;
    accessToken: string | null;
    refreshToken: string | null;
    expiration: Date | null;
}