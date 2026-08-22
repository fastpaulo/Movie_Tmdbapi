declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private router = inject(Router);
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '892508407285-7dfaten255c5fat7dfjpsds41q8dsvsq.apps.googleusercontent.com',
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
}