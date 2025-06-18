import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models/auth/loginResponse';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private toastrService: ToastrService, private ar: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.ar.queryParams.subscribe(params => {
      if (params['code']) {
        this.callback(params['code']);
      } else {
        this.toastrService.error('No code found in URL');
        this.router.navigate(['/login']);
      }
    });
  }

  callback(code: string) {
    if (code) {
      this.authService.callback(code).subscribe((response: LoginResponse) => {
        if (response.isSuccess && response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken.toString());
          localStorage.setItem('refreshToken', response.refreshToken.toString());
          this.toastrService.success("Login Success", response.message);
          this.toastrService.info('You are redirected to the home page');
          this.router.navigate(['/home']);
          return;
        }
      }, error => {
        this.toastrService.error('Authentication failed');
        this.router.navigate(['/home']);
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

}
