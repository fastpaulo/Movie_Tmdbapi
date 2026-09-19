import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Favorite } from '../../services/favorite';
import { DecimalPipe } from '@angular/common'; // Mantive DatePipe caso decida usar
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-movies-favorites',
  standalone: true, // Adicionado para manter o padrão moderno do Angular
  imports: [DecimalPipe, NavBar],
  styleUrl: './movies-favorites.css',
  templateUrl: './movies-favorites.html',
})
export class MoviesFavorites implements OnInit {
  private router = inject(Router);
  private favoritesService = inject(Favorite);

  myMovies = signal<any[]>([]);
  userId = signal<string | null>(null);
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  ngOnInit() {
    this.loadUserSession();
    this.listMyMovies();
  }

  // Lógica de sessão centralizada e com tratamento de erro
  loadUserSession() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        if (user && user.email) {
          this.userId.set(user.email);
        }
      } catch (error) {
        console.error('Sessão inválida', error);
      }
    }
  }

  listMyMovies() {
    const email = this.userId();
    if (email) {
      this.favoritesService.getFavorites(email).subscribe({
        next: (myMovies) => this.myMovies.set(myMovies),
        error: (err) => console.error('Erro ao buscar favoritos', err)
      });
    }
  }

  // Agora removeFavorite usa await de forma limpa e consome o signal userId
  async removeFavorite(movieId: number) {
    const email = this.userId();
    if (email) {
      try {
        await this.favoritesService.removeFavorite(email, movieId);
      } catch (error) {
        console.error('Erro ao remover filme dos favoritos:', error);
      }
    }
  }

  // Renomeado para camelCase
  movieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }
}