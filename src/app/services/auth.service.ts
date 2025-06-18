import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/auth/loginResponse';
import { LoginRequestDto } from '../models/auth/loginRequestDto';
import { RegisterRequestDto } from '../models/auth/registerRequestDto';
import { RegisterResponse } from '../models/auth/registerResponse';
import { GoogleAuthenticationResponse } from '../models/auth/googleAuthenticationResponse';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = 'http://localhost:5000/api/Auths/';

  constructor(private httpClient: HttpClient, private jwtHelperService: JwtHelperService) { }

  login(object: LoginRequestDto): Observable<LoginResponse> {
    let url = this.auth + 'Login';
    return this.httpClient.post<LoginResponse>(url, object);
  }

  register(object: RegisterRequestDto): Observable<RegisterResponse> {
    let url = this.auth + 'Register';
    return this.httpClient.post<RegisterResponse>(url, object);
  }

  getGoogleAuthentication(): Observable<GoogleAuthenticationResponse> {
    let url = this.auth + 'LoginWithGoogle';
    return this.httpClient.get<GoogleAuthenticationResponse>(url);
  }

  callback(code: string): Observable<LoginResponse> {
    let url = this.auth + 'Callback?code=' + code;
    return this.httpClient.get<LoginResponse>(url);
  }

  loggedIn() {
    return !this.jwtHelperService.isTokenExpired(localStorage.getItem('accessToken') || '');
  }

  decodeToken(token: any) {
    return this.jwtHelperService.decodeToken(token);
  }

  getUserInfo() {
    const token = localStorage.getItem('accessToken');
    if (token && this.loggedIn()) {
      const decodedToken = this.decodeToken(token);
      const claimInfo = Object.keys(decodedToken).find(x => x.endsWith("/emailaddress"));


      console.log("Decoded Token: ", claimInfo);
      return claimInfo ? decodedToken[claimInfo] : null;
    }
    return null;
  }


}
