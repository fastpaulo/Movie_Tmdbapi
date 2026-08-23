import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard-guard';
import { MovieDetails } from './components/movie-details/movie-details';
import { MovieTrailer } from './components/movie-trailer/movie-trailer';



export const routes: Routes = [
    { path: '', component: Login },
    { path: 'home', component: Home ,canActivate: [authGuard] },
    {path: 'movie-details/:id', component: MovieDetails, canActivate: [authGuard] },
    {path: 'movie-trailer/:id', component: MovieTrailer, canActivate: [authGuard] },
    
];
