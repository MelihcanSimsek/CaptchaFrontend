import { Component, OnInit } from '@angular/core';
import { CaptchaService } from '../../services/captcha.service';
import {FormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenerateCaptchaResponse } from '../../models/generateCaptchaResponse';
import { GenerateSoundCaptchaResponse } from '../../models/generateSoundCaptchaResponse';
import { GenerateTextAndSoundCaptchaResponse } from '../../models/generateTextAndSoundCaptchaResponse';

@Component({
  selector: 'app-captcha-screen',
  imports: [FormsModule],
  templateUrl: './captcha-screen.component.html',
  styleUrl: './captcha-screen.component.css'
})
export class CaptchaScreenComponent implements OnInit {
  captchaImage64: string = '';
  mimeType: string = '';
  captchaInput:string='';
  captchaSound64: string = '';
  soundType: string = '';
  audioSource:string | null = null;
  currentCaptcha:number = 1;

  constructor(private captchaService:CaptchaService,private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.getCaptcha();
  }

  getCaptcha() {
    this.resetCaptcha();
    if (this.currentCaptcha === 1) {
    this.captchaService.getTextCaptcha().subscribe((data: GenerateCaptchaResponse) => {
      this.captchaImage64 = data.captchaImage64;
      this.mimeType = data.mimeType;
      sessionStorage.setItem('captchaToken', data.token);
    });
  }else if (this.currentCaptcha === 2) {
    this.captchaService.getSoundCaptcha().subscribe((data:GenerateSoundCaptchaResponse) => {
      this.captchaSound64 = data.captchaSound64;
      this.soundType = data.soundType;
      this.audioSource = `data:${data.soundType};base64,${data.captchaSound64}`;
      sessionStorage.setItem('captchaToken', data.token);
    });
  }else if (this.currentCaptcha === 3) {
    this.captchaService.getTextAndSoundCaptcha().subscribe((data: GenerateTextAndSoundCaptchaResponse) => {
      this.captchaImage64 = data.captchaImage64;
      this.mimeType = data.mimeType;
      this.captchaSound64 = data.captchaSound64;
      this.soundType = data.soundType;
      this.audioSource = `data:${data.soundType};base64,${data.captchaSound64}`;
      sessionStorage.setItem('captchaToken', data.token);
    });
  }
  }

  resetCaptcha() {
    this.captchaInput = '';
    this.mimeType = '';
    this.captchaImage64 = '';
    this.captchaSound64 = '';
    this.soundType = '';
    this.audioSource = null;
    sessionStorage.removeItem('captchaToken');
  }

  Refresh() {
    this.getCaptcha();
    this.toastrService.info('Captcha refreshed');
  }

  Submit(): void {
    this.captchaService.checkCptcha(sessionStorage.getItem('captchaToken')?.toString(), this.captchaInput).subscribe((data) => {
      if (data.isSuccess) {
        this.toastrService.success(data.message,"Captcha Success");
      } else {
        this.toastrService.error(data.message,"Captcha Failed");
      }
      this.captchaInput = '';
      this.getCaptcha();
    }, error => {
      this.toastrService.error('An error occurred while checking the captcha.');
    });
  }

  goToHome()
  {
    window.location.href = '/home';
  }

  ChangeCaptcha(currentCaptcha: number): void {
    this.currentCaptcha = currentCaptcha;
    this.getCaptcha();
  }


  PlayAudio()
  {
    if (this.audioSource) {
      const audio = new Audio(this.audioSource);
      audio.play().catch(error => {
        this.toastrService.error('Error playing audio: ' + error.message);
      });
    } else {
      this.toastrService.error('No audio source available.');
    }
  }

}
