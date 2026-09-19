import { Component, inject, OnInit, signal } from '@angular/core';
import { TmdbMovies } from '../../services/tmdb-movies';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { switchMap, of, map } from 'rxjs'; // Importamos os operadores RxJS

@Component({
  selector: 'app-movie-trailer',
  standalone: true,
  imports: [], // Sem dependências externas de UI necessárias aqui
  styleUrl: './movie-trailer.css',
  templateUrl: './movie-trailer.html'
})
export class MovieTrailer implements OnInit {
  movieId: number = 0; // Recebido via initialState do modal

  // Padronização: Tudo usando inject()
  private movieService = inject(TmdbMovies);
  private sanitizer = inject(DomSanitizer);
  public bsModalRef = inject(BsModalRef);

  trailerUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoading.set(true);

    this.movieService.getWatchTrailerUrl(this.movieId, 'pt-BR').pipe(
      // switchMap intercepta o resultado e nos permite encadear outro Observable
      switchMap((res: any) => {
        const trailer = res.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
        
        // Se achou em PT-BR, retorna o trailer direto
        if (trailer) return of(trailer);
        
        // Se não achou, encadeia a busca em en-US
        return this.movieService.getWatchTrailerUrl(this.movieId, 'en-US').pipe(
          map((enRes: any) => enRes.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') || enRes.results[0])
        );
      })
    ).subscribe({
      next: (trailerData) => {
        if (trailerData && trailerData.key) {
          this.setSafeUrl(trailerData.key);
        } else {
          this.isLoading.set(false);
          // Opcional: mostrar uma mensagem de erro caso não exista trailer algum
        }
      },
      error: (err) => {
        console.error('Erro ao buscar trailer:', err);
        this.isLoading.set(false);
      }
    });
  }

  private setSafeUrl(youtubeKey: string): void {
    const rawUrl = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1`;
    this.trailerUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl));
    this.isLoading.set(false);
  }

  closePlayer(): void {
    this.bsModalRef.hide();
  }
}