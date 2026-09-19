import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, DecimalPipe, DatePipe } from '@angular/common'; // Importamos Location
import { NavBar } from '../nav-bar/nav-bar';
import { MovieDetail } from '../../interface/tmdb-movies';
import { TmdbMovies } from '../../services/tmdb-movies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MovieTrailer } from '../movie-trailer/movie-trailer';
import { Favorite } from '../../services/favorite';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NavBar, DecimalPipe, DatePipe],
  styleUrl: './movie-details.css',
  templateUrl: './movie-details.html',
})
export class MovieDetails implements OnInit {
  // Padronização: Tudo usando inject()
  protected tmdbservice = inject(TmdbMovies);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private bsModalService = inject(BsModalService);
  private favoritesService = inject(Favorite);

  bsmodalRef?: BsModalRef;
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  
  movie = signal<MovieDetail | null>(null);
  isFavorite = signal<boolean>(false); // Novo: controla o estado do botão
  userId = signal<string | null>(null);

  ngOnInit(): void {
    this.checkUserSession();
    const movieId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (movieId) {
      this.tmdbservice.getMovieDetails(movieId).subscribe({
        next: (data) => {
          this.movie.set(data);
          this.checkIfIsFavorite(data.id); // Verifica se é favorito ao carregar
        },
        error: (err) => console.error('Erro ao buscar detalhes:', err)
      });
    }
  }

  checkUserSession() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        this.userId.set(user.email);
      } catch (e) {
        console.error('Erro na sessão', e);
      }
    }
  }

  // Busca os favoritos do usuário e checa se ESTE filme está lá
  checkIfIsFavorite(movieId: number) {
    const email = this.userId();
    if (email) {
      this.favoritesService.getFavorites(email).subscribe({
        next: (favorites) => {
          const exists = favorites.some((fav: any) => String(fav.id) === String(movieId));
          this.isFavorite.set(exists);
        }
      });
    }
  }

  goBack(): void {
    this.location.back(); // Volta para a rota anterior (mantém o histórico/scroll)
  }

  watchTrailer(movie: MovieDetail): void {
    this.bsmodalRef = this.bsModalService.show(MovieTrailer, {
      initialState: { movieId: movie.id },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  async toggleFavorite(movie: any): Promise<void> {
    const email = this.userId();

    if (!email) {
      alert('Entre na sua conta para favoritar filmes.');
      return;
    }

    try {
      if (this.isFavorite()) {
        await this.favoritesService.removeFavorite(email, movie.id);
        this.isFavorite.set(false);
      } else {
        await this.favoritesService.addFavorite(email, movie);
        this.isFavorite.set(true);
      }
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
      alert('Ocorreu um erro ao atualizar os favoritos.');
    }
  }
}