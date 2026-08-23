import { Component, inject , signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { TmdbMovies } from '../../services/tmdb-movies';
import { DecimalPipe, DatePipe } from '@angular/common';
import {NavBar} from '../nav-bar/nav-bar';
@Component({
  imports: [ DecimalPipe, DatePipe, NavBar],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private router = inject(Router);
  movies = signal<any[]>([]);
  
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';


private tmdbservice = inject(TmdbMovies);

ngOnInit() {
    this.tmdbservice.getPopularMovies().subscribe(
      (response) => {
        
        this.movies.set(response.results);
        
      },
      (error) => {
        console.error('Erro ao buscar filmes populares:', error);
      }
    );
  }
MovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }
}
