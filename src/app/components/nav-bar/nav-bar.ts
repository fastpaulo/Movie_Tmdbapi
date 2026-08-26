declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth'; // Seu serviço de auth (se ainda precisar)
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar implements OnInit {
  auth = inject(Auth);
  
  name?: string;
  email?: string;
  imageProfile?: string;
  
  private tokenClient: any;
  router = inject(Router);

  ngOnInit() {
   
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      this.name = userData.name;
      this.email = userData.email;
      this.imageProfile = userData.picture; 
    }

    
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.keyGoogle,
      scope: 'email profile openid', 
      callback: (response: any) => this.handleLogin(response)
    });
  }

  handleLogin(response: any) {
    if (response && response.access_token) {
      
      this.fetchGoogleProfile(response.access_token); 
    }
  }


  private fetchGoogleProfile(token: string): void {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((userData) => {
        this.name = userData.name;
        this.email = userData.email;
        this.imageProfile = userData.picture;
        
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        window.location.reload();
      })
      .catch((err) => console.error('Erro ao buscar perfil do Google', err));
  }

  buttonLogin() {
    this.tokenClient.requestAccessToken();
  }

  signOut() {
   
    sessionStorage.removeItem('user');
    
    
    this.name = undefined;
    this.email = undefined;
    this.imageProfile = undefined;

   
    this.auth.signOut();
    window.location.reload();
  }
}