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
    // 1. CARREGAR DADOS SALVOS (Para manter o login no F5)
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      this.name = userData.name;
      this.email = userData.email;
      this.imageProfile = userData.picture; // O Google salva como 'picture'
    }

    // 2. CORREÇÃO DO SCOPE: Adicionado 'profile' e 'openid'
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.keyGoogle,
      scope: 'email profile openid', // <-- ESSENCIAL para pegar nome e foto
      callback: (response: any) => this.handleLogin(response)
    });
  }

  handleLogin(response: any) {
    if (response && response.access_token) {
      // Apenas chama o método, não precisa jogar numa variável
      this.fetchGoogleProfile(response.access_token); 
    }
  }

  // Renomeei para fetchGoogleProfile para ficar mais claro o que ele faz
  private fetchGoogleProfile(token: string): void {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((userData) => {
        // Atualiza a tela
        this.name = userData.name;
        this.email = userData.email;
        this.imageProfile = userData.picture;
        
        // Salva no sessionStorage para sobreviver ao F5
        sessionStorage.setItem('user', JSON.stringify(userData));
        window.location.reload();
      })
      .catch((err) => console.error('Erro ao buscar perfil do Google', err));
  }

  buttonLogin() {
    this.tokenClient.requestAccessToken();
  }

  signOut() {
    // 1. Limpa o storage
    sessionStorage.removeItem('user');
    
    // 2. Limpa a tela (remove os dados da Navbar para o @else do HTML ativar)
    this.name = undefined;
    this.email = undefined;
    this.imageProfile = undefined;

    // 3. Chama o seu serviço interno
    this.auth.signOut();
    window.location.reload();
  }
}