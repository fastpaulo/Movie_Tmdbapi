import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { TmdbMovies } from '../../services/tmdb-movies';
import { DecimalPipe, DatePipe } from '@angular/common';
import { NavBar } from '../nav-bar/nav-bar';
import { Favorite } from '../../services/favorite';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DecimalPipe, 
    DatePipe, 
    NavBar, 
    ReactiveFormsModule, 
    InfiniteScrollDirective
  ],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private router = inject(Router);
  private favoritesService = inject(Favorite);
  private tmdbservice = inject(TmdbMovies);

  movies = signal<any[]>([]);
  myMovies = signal<any[]>([]);
  userId = signal<string>('');
  
  // 🔥 NOVO: Computed signal para performance! Ele cria uma lista rápida de IDs favoritos.
  favoriteMovieIds = computed(() => {
    return new Set(this.myMovies().map(fav => String(fav.id)));
  });

  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  isLoading = signal<boolean>(false);
  isLoadingMore = signal<boolean>(false);
  currentPage = 1;
  totalPages = 1;
  currentQuery = '';

  searchControl = new FormControl('');

  ngOnInit() {
    this.userSession();
    this.listMyMovies();
    this.loadMovies(1, true);

    // Agora isso vai funcionar porque vamos vincular no HTML
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((query) => {
      this.currentQuery = query ? query.trim() : '';
      this.currentPage = 1;
      this.loadMovies(1, true);
    });
  }

  loadMovies(page: number, replace: boolean = false) {
    if (replace) {
      this.isLoading.set(true);
    } else {
      this.isLoadingMore.set(true);
    }

    const request$ = this.currentQuery
      ? this.tmdbservice.searchMovies(this.currentQuery, page)
      : this.tmdbservice.getPopularMovies(page);

    request$.subscribe({
      next: (response: any) => {
        this.totalPages = response.total_pages || 1;
        this.currentPage = page;

        if (replace) {
          this.movies.set(response.results || []);
        } else {
          this.movies.update((current) => {
            const existingIds = new Set(current.map((m) => m.id));
            const newUnique = (response.results || []).filter((m: any) => !existingIds.has(m.id));
            return [...current, ...newUnique];
          });
        }

        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar filmes:', err);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      }
    });
  }

  loadNextPage() {
    if (this.isLoading() || this.isLoadingMore()) return;
    if (this.currentPage >= this.totalPages) return;
    this.loadMovies(this.currentPage + 1, false);
  }

  // Renomeado para padrão camelCase
  movieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }

  listMyMovies() {
    const userId = this.userId();
    if (userId) {
      this.favoritesService.getFavorites(userId).subscribe({
        next: (myMovies) => this.myMovies.set(myMovies)
      });
    }
  }

  async removeFavorite(movieId: number) {
    const userId = this.userId();
    if (userId) {
      try {
        await this.favoritesService.removeFavorite(userId, movieId);
        this.listMyMovies();
      } catch (error) {
        console.error('Erro ao remover filme dos favoritos:', error);
      }
    }
  }

  async toggleFavorite(movie: any, event: MouseEvent): Promise<void> {
    event.stopPropagation(); // Impede o clique de abrir os detalhes do filme
    const userId = this.userId();
    
    if (userId) {
      // Usamos o Set criado no Computed para verificação ultra-rápida
      if (this.favoriteMovieIds().has(String(movie.id))) {
        await this.favoritesService.removeFavorite(userId, movie.id);
      } else {
        await this.favoritesService.addFavorite(userId, movie);
      }
      
    } else {
      alert('Entre na sua conta para favoritar');
    }
  }

  userSession() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        if (user && user.email) {
          this.userId.set(user.email);
        }
      } catch (e) {
        console.error('Sessão inválida', e);
      }
    }
  }
  
  // 🔥 Funções searchMovie() e clearSearch() foram DELETADAS. 
  // O RxJS no ngOnInit cuida de tudo automaticamente agora!
}