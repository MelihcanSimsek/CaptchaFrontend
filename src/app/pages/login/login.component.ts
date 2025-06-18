import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CaptchaService } from '../../services/captcha.service';
import { GenerateTextAndSoundCaptchaResponse } from '../../models/generateTextAndSoundCaptchaResponse';
import { LoginRequestDto } from '../../models/auth/loginRequestDto';
import { LoginResponse } from '../../models/auth/loginResponse';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleAuthenticationResponse } from '../../models/auth/googleAuthenticationResponse';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  captchaImage64: string = '';
  mimeType: string = '';
  captchaSound64: string = '';
  soundType: string = '';
  audioSource: string | null = null;
  authenticationUrl: string = '';

  constructor(private authService: AuthService,
    private toastrService: ToastrService,
    private captchaService: CaptchaService,
    private router: Router,
    private fb: FormBuilder) { 
      this.loginForm
       = this.fb.group({
        email:['',Validators.required],
        password:['',Validators.required],
        captcha:['',Validators.required]
       })
    }

  ngOnInit(): void {
    this.getCaptcha();
    this.getAuthenticationUrl();
  }

  resetCaptcha() {
    this.mimeType = '';
    this.captchaImage64 = '';
    this.captchaSound64 = '';
    this.soundType = '';
    this.audioSource = null;
    sessionStorage.removeItem('captchaToken');
  }

  getAuthenticationUrl() {
    this.authService.getGoogleAuthentication().subscribe((data:GoogleAuthenticationResponse)=>{
      this.authenticationUrl = data.authenticationUrl;
    })
  } 


  googleLogin(){
   window.location.href = this.authenticationUrl;
  }

  getCaptcha() {
    this.resetCaptcha();
    this.captchaService.getTextAndSoundCaptcha().subscribe((data: GenerateTextAndSoundCaptchaResponse) => {
      this.captchaImage64 = data.captchaImage64;
      this.mimeType = data.mimeType;
      this.captchaSound64 = data.captchaSound64;
      this.soundType = data.soundType;
      this.audioSource = `data:${data.soundType};base64,${data.captchaSound64}`;
      sessionStorage.setItem('captchaToken', data.token);
    });
  }

  Refresh() {
    this.getCaptcha();
    this.toastrService.info('Captcha refreshed');
  }

  Login() {
    const captchaToken: string | undefined = sessionStorage.getItem('captchaToken')?.toString();
    if (this.loginForm.invalid){
      this.toastrService.error('Please fill in all required fields.');
      return;
    }
    if (!captchaToken) {
      this.toastrService.error('Captcha token is missing. Please refresh the captcha.');
      return;
    }


    const loginDto: LoginRequestDto = {
      token: captchaToken,
      answer: this.loginForm.value.captcha,
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    this.authService.login(loginDto).subscribe({
      next: (response: LoginResponse) => {
        if (response.isSuccess && response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken.toString());
          localStorage.setItem('refreshToken', response.refreshToken.toString());
          this.toastrService.success("Login Success", response.message);
          this.toastrService.info('You are redirected to the home page');
          this.router.navigate(['/home']);
          return;
        }

        this.toastrService.error('Login failed: ' + response.message);
        this.resetCaptcha();
        this.getCaptcha();
      },
      error: (error) => {
        this.toastrService.error('Login failed: ' + error.message);
        this.resetCaptcha();
        this.getCaptcha();
      }
    });
  }


  PlayAudio() {
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
