import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavBar } from '../nav-bar/nav-bar';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MovieDetail } from '../../interface/tmdb-movies';
import { TmdbMovies } from '../../services/tmdb-movies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MovieTrailer } from '../movie-trailer/movie-trailer';
import { Firestore } from '@angular/fire/firestore';
import { Favorite } from '../../services/favorite';

@Component({
  imports: [NavBar, DecimalPipe, DatePipe],
  selector: 'app-movie-details',
  styleUrl: './movie-details.css',
  templateUrl: './movie-details.html',
})
export class MovieDetails {
  email: string = ""
  bsmodalRef?: BsModalRef;
  constructor(private bsModalService: BsModalService) { }
  protected tmdbservice = inject(TmdbMovies);
  private activatedRoute = inject(ActivatedRoute);
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  movie = signal<MovieDetail | null>(null);
  private router = inject(Router);
  private favoritesService = inject(Favorite);

  ngOnInit(): void {
    const movieId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (movieId) {
      this.tmdbservice.getMovieDetails(movieId).subscribe({
        next: (data) => this.movie.set(data),
        error: (err) => console.error('Erro ao buscar detalhes:', err)
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }

  watchTrailer(Movie: MovieDetail): void {
    this.movie.set(Movie)
    this.bsmodalRef = this.bsModalService.show(MovieTrailer, {
      initialState: {
        movieId: Movie.id
      },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  async toggleFavorite(movie: any): Promise<void> {
    try {
      const userSession = sessionStorage.getItem('user');
      if (userSession) {
        const user = JSON.parse(userSession);
        const email = user.email;
        console.log("email", email);
        await this.favoritesService.addFavorite(email, movie);
        alert('Filme salvo nos Favoritos com sucesso!');
      }

    } catch (error) {
      console.error('Erro ao salvar no Firestore:', error);
    }
  }
}
