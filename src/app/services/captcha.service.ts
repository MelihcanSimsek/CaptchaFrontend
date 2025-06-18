import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerateCaptchaResponse } from '../models/generateCaptchaResponse';
import { CaptchaCheckResponseDto } from '../models/captchaCheckResponseDto';
import { GenerateSoundCaptchaResponse } from '../models/generateSoundCaptchaResponse';
import { GenerateTextAndSoundCaptchaResponse } from '../models/generateTextAndSoundCaptchaResponse';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private capcha = 'http://localhost:5000/api/Captcha/';
  constructor(private httpClient: HttpClient) { }

  getTextCaptcha(): Observable<GenerateCaptchaResponse> {
    let url = this.capcha + 'GetTextCaptcha';
    return this.httpClient.get<GenerateCaptchaResponse>(url);
  }

  getSoundCaptcha(): Observable<GenerateSoundCaptchaResponse> {

    let url = this.capcha + 'GetSoundCaptcha';
    return this.httpClient.get<GenerateSoundCaptchaResponse>(url);
  }

  getTextAndSoundCaptcha(): Observable<GenerateTextAndSoundCaptchaResponse> {

    let url = this.capcha + 'GetTextAndSoundCaptcha';
    return this.httpClient.get<GenerateTextAndSoundCaptchaResponse>(url);
  }

  checkCptcha(token: string | undefined, captchaText: string): Observable<CaptchaCheckResponseDto> {
    let url = this.capcha + 'CheckCaptcha';
    const CaptchaCheckRequestDto = {
      answer: captchaText,
      token: token
    };
    return this.httpClient.post<CaptchaCheckResponseDto>(url, CaptchaCheckRequestDto);
  }

}
