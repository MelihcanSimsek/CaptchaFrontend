export interface GenerateTextAndSoundCaptchaResponse {
    token: string;
    captchaImage64: string;
    mimeType: string;
    captchaSound64: string;
    soundType: string;
}