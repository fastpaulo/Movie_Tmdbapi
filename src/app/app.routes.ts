import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard-guard';
import { MovieDetails } from './components/movie-details/movie-details';
import { MovieTrailer } from './components/movie-trailer/movie-trailer';
import { MoviesFavorites } from './components/movies-favorites/movies-favorites';



export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    {path: 'movie-details/:id', component: MovieDetails },
    {path: 'movie-trailer/:id', component: MovieTrailer},
    { path: 'movie-favorites', component: MoviesFavorites, canActivate: [authGuard] },
    
];
