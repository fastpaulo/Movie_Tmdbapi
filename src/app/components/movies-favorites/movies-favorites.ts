import { Component, inject, signal } from '@angular/core';
import { Favorite } from '../../services/favorite';
import { Search } from '../../services/search';
import { TmdbMovies } from '../../services/tmdb-movies';
import { Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  imports: [DecimalPipe, NavBar],
  selector: 'app-movies-favorites',
  styleUrl: './movies-favorites.css',
  templateUrl: './movies-favorites.html',
})
export class MoviesFavorites {
  private router = inject(Router);
  myMovies = signal<any[]>([]);
  private favoritesService = inject(Favorite);
  userId = signal<string>('');
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  ngOnInit() {
    this.listMyMovies();
  }

  userSession() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      const user = JSON.parse(userSession);
      const userId = user.email;
      this.userId.set(userId);
    }
  }
  listMyMovies() {
    const userSession = sessionStorage.getItem('user') || '{}';
   
    const user = JSON.parse(userSession);
    const userId = user.email;
    
    this.favoritesService.getFavorites(userId).subscribe({
      next: (myMovies) => {
        this.myMovies.set(myMovies);
      }
    });
  }
  removeFavorite(movieId: number) {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      const user = JSON.parse(userSession);
      const userId = user.email;
      this.favoritesService.removeFavorite(userId, movieId).then(() => {
        
        this.listMyMovies();
      }).catch((error) => {
       
      });
    }
  }
  isFavorite(movieId: string | number): boolean {
    return this.myMovies().some((fav) => String(fav.id) === String(movieId));
  }
  async toggleFavorite(movie: any, event: MouseEvent): Promise<void> {
    event.stopPropagation(); // Evita acionar o clique de detalhes do card

    if (this.isFavorite(movie.id)) {
      await this.favoritesService.removeFavorite(this.userId(), movie.id);
    } else {
      await this.favoritesService.addFavorite(this.userId(), movie);
    }
  }
  MovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }

}
