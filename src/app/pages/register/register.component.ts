import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CaptchaService } from '../../services/captcha.service';
import { GenerateTextAndSoundCaptchaResponse } from '../../models/generateTextAndSoundCaptchaResponse';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterRequestDto } from '../../models/auth/registerRequestDto';
import { RegisterResponse } from '../../models/auth/registerResponse';
import { GoogleAuthenticationResponse } from '../../models/auth/googleAuthenticationResponse';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerFrom: FormGroup;

  captchaImage64: string = '';
  mimeType: string = '';
  captchaSound64: string = '';
  soundType: string = '';
  audioSource: string | null = null;
  authenticationUrl: string = '';


  constructor(private authService: AuthService,
    private toastrService: ToastrService,
    private captchaService: CaptchaService,
    private fb: FormBuilder,
    private router: Router) {
    this.registerFrom = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCaptcha();
    this.getAuthenticationUrl();
  }

  getAuthenticationUrl() {
    this.authService.getGoogleAuthentication().subscribe((data:GoogleAuthenticationResponse)=>{
      this.authenticationUrl = data.authenticationUrl;
    })
  } 

  googleLogin(){
   window.location.href = this.authenticationUrl;
  }

  Register() {
    if (this.registerFrom.invalid) {
      this.toastrService.error('Please fill all required fields');
      return;
    }

    const captchaToken: string | undefined = sessionStorage.getItem('captchaToken')?.toString();
    if (!captchaToken) {
      this.toastrService.error('Captcha token is missing. Please refresh the captcha.');
      return;
    }

    const registerRequest: RegisterRequestDto = {
      email: this.registerFrom.value.email,
      fullName: this.registerFrom.value.fullName,
      password: this.registerFrom.value.password,
      confirmPassword: this.registerFrom.value.confirmPassword,
      answer: this.registerFrom.value.captcha,
      token: captchaToken
    };


    this.authService.register(registerRequest).subscribe({
      next: (response: RegisterResponse) => {
        if (response.isSuccess) {
          this.toastrService.success('Registration success', "You are now registered");
          this.toastrService.info('You are redirected to login page');
          this.router.navigate(['/login']);
          return;
        }

        this.toastrService.info("Registration Failed: " + response.message);
        this.registerFrom.reset();
        this.resetCaptcha();
      },
      error: (error) => {
        this.toastrService.error('Registration failed: ' + error.error.message);
        this.registerFrom.reset();
        this.resetCaptcha();
      }
    });

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

  resetCaptcha() {
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
