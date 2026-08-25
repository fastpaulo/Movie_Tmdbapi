import { Component, inject, signal } from '@angular/core';
import { TmdbMovies } from '../../services/tmdb-movies';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  imports: [],
  selector: 'app-movie-trailer',
  styleUrl: './movie-trailer.css',
  templateUrl: './movie-trailer.html',
  standalone: true
})
export class MovieTrailer {
   movieId: number =0;
  private movieService = inject(TmdbMovies);
  private sanitizer = inject(DomSanitizer);
  constructor(public bsModalRef: BsModalRef) {  }

  trailerUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.movieService.getWatchTrailerUrl(this.movieId, 'pt-BR').subscribe({
      next: (res) => {
        let trailer = res.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');

        if (!trailer) {
          this.movieService.getWatchTrailerUrl(this.movieId, 'en-US').subscribe({
            next: (enRes) => {
              trailer = enRes.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') || enRes.results[0];
              this.setSafeUrl(trailer?.key);
            }
          });
        } else {
          this.setSafeUrl(trailer.key);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }
  private setSafeUrl(youtubeKey?: string): void {
    this.isLoading.set(false);
    if (youtubeKey) {
      const rawUrl = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1`;
      this.trailerUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl));
    }
  }
  closePlayer(): void {
    this.bsModalRef.hide();
  }
 
}
