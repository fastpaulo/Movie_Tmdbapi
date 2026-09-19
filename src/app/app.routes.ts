import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard-guard';

// 🗑️ APAGUE TODAS AS IMPORTAÇÕES DE COMPONENTES LÁ NO TOPO!
// Você não faz mais o import { Home } from '...', o Angular fará isso dinamicamente.

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(c => c.Login) 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home').then(c => c.Home) 
  },
  { 
    path: 'movie-details/:id', 
    loadComponent: () => import('./components/movie-details/movie-details').then(c => c.MovieDetails) 
  },
  { 
    path: 'movie-favorites', 
    loadComponent: () => import('./components/movies-favorites/movies-favorites').then(c => c.MoviesFavorites),
    canActivate: [authGuard] 
  },
  { 
    path: '**', 
    redirectTo: 'home' 
  }
];