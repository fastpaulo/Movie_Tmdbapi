import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { TmdbMovies } from '../../services/tmdb-movies';
import { DecimalPipe, DatePipe } from '@angular/common';
import { NavBar } from '../nav-bar/nav-bar';
import { Favorite } from '../../services/favorite';
import { Search } from '../../services/search';
@Component({
  imports: [DecimalPipe, DatePipe, NavBar],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private router = inject(Router);
  movies = signal<any[]>([]);
  myMovies = signal<any[]>([]);
  private favoritesService = inject(Favorite);
  userId = signal<string>('');

  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  private searchMovies = inject(Search);
  private tmdbservice = inject(TmdbMovies);

  ngOnInit() {
    this.listMyMovies();
    this.userSession();
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
  listMyMovies() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      const user = JSON.parse(userSession);
      const userId = user.email;
      console.log('ID do usuário:', userId);
      this.favoritesService.getFavorites(userId).subscribe({
        next: (myMovies) => {
          this.myMovies.set(myMovies);
          console.log('Filmes favoritos do usuário:', myMovies);
        }
      });
    }
  }
  removeFavorite(movieId: number) {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      const user = JSON.parse(userSession);
      const userId = user.email;
      this.favoritesService.removeFavorite(userId, movieId).then(() => {
        console.log(`Filme com ID ${movieId} removido dos favoritos do usuário ${userId}`);
        this.listMyMovies();
      }).catch((error) => {
        console.error('Erro ao remover filme dos favoritos:', error);
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

  userSession() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      const user = JSON.parse(userSession);
      const userId = user.email;
      this.userId.set(userId);
    }
  }
  searchMovie(query: string) {
    this.searchMovies.searchMovies(query).subscribe({
      next: (response) => {
        this.movies.set(response.results);
      },
      error: (error) => {
        console.error('Erro ao buscar filmes:', error);
      }
    });
  }
  clearSearch() {
    this.tmdbservice.getPopularMovies().subscribe({
      next: (response) => {
        this.movies.set(response.results);
      },
      error: (error) => {
        console.error('Erro ao buscar filmes populares:', error);
      }
    });
   }
}
