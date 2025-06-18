import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  emailInfo:string = '';
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.getEmailInfo();
  }

  getEmailInfo() {
    this.emailInfo = this.authService.getUserInfo();
    console.log(this.emailInfo);
  }


  logout(){
    localStorage.removeItem('refreshToken'); 
    localStorage.removeItem('accessToken'); 
    window.location.reload();
  }

  goToCaptcha() {
    window.location.href = '/';
  }

}
