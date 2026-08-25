declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private router = inject(Router);
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    this.buttonLogin();
  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handleLogin(response: any) {
    if (response) {
      //decodificar token
      const payLoad = this.decodeToken(response.credential);
      //armazenar token na sessao
      sessionStorage.setItem('user', JSON.stringify(payLoad));
      //redirecionar para a home
      this.router.navigate(['/home']);
    }
  }

  buttonLogin() { 
google.accounts.id.initialize({
      client_id: environment.keyGoogle,
      callback: (response: any) => this.handleLogin(response)
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'filled_black',
        size: 'large',
        shape: 'rectangular'
      }
    );
  }

}