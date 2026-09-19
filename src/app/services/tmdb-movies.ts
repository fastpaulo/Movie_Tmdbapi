import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core'; // 🔥 Corrigido: Injectable
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { TmdbSearchResponse, VideoResponse } from '../interface/tmdb-movies';

// 🔥 Interface do Firebase foi removida e deve ir para o arquivo favorite.ts (onde pertence)

@Injectable({
  providedIn: 'root'
}) // 🔥 Corrigido: Usando o padrão correto do Angular
export class TmdbMovies {
  private http = inject(HttpClient);
  
  url = environment.tmdbBaseUrl;
  imageBaseUrl = 'https://image.tmdb.org/t/p'; // Removi a barra final para não dar conflito
  
  

  // ==========================================
  // FUNÇÃO PRIVADA REUTILIZÁVEL (O Segredo para código limpo)
  // ==========================================
  private fetchWithLanguageFallback(endpointUrl: string, extraParams: HttpParams = new HttpParams()): Observable<TmdbSearchResponse> {
    const paramsPt = extraParams.set('language', 'pt-BR');
    const paramsEn = extraParams.set('language', 'en-US');

    return forkJoin({
      ptData: this.http.get<TmdbSearchResponse>(endpointUrl, {  params: paramsPt }),
      enData: this.http.get<TmdbSearchResponse>(endpointUrl, {  params: paramsEn })
    }).pipe(
      map(({ ptData, enData }) => {
        ptData.results = ptData.results.map((movie, index) => {
          if (!movie.overview || movie.overview.trim() === '') {
            if (enData.results[index]) {
              movie.overview = enData.results[index].overview;
            }
          }
          return movie;
        });
        return ptData;
      })
    );
  }

  // ==========================================
  // MÉTODOS PÚBLICOS
  // ==========================================

  searchMovies(query: string, page: number = 1): Observable<TmdbSearchResponse> {
    const endpoint = `${this.url}/search/movie`;
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString());
      
    // Reutiliza a lógica genérica!
    return this.fetchWithLanguageFallback(endpoint, params);
  }

  getPopularMovies(page = 1): Observable<TmdbSearchResponse> {
    const endpoint = `${this.url}/movie/popular`;
    const params = new HttpParams().set('page', page.toString());

    // Reutiliza a lógica genérica!
    return this.fetchWithLanguageFallback(endpoint, params);
  }

  getMovieDetails(movieId: number): Observable<any> {
    const endpoint = `${this.url}/movie/${movieId}`;
    const paramsPt = new HttpParams().set('language', 'pt-BR');

    return this.http.get<any>(endpoint, {  params: paramsPt }).pipe(
      switchMap(moviePt => {
        // Se já tem sinopse, retorna ele mesmo
        if (moviePt.overview && moviePt.overview.trim() !== '') {
          return of(moviePt);
        }

        // Se não tem, busca o em inglês
        const paramsEn = new HttpParams().set('language', 'en-US');
        return this.http.get<any>(endpoint, {  params: paramsEn }).pipe(
          map(movieEn => {
            moviePt.overview = movieEn.overview;
            return moviePt;
          })
        );
      })
    );
  }

  getBackdropUrl(path: string | null | undefined, size: 'w300' | 'w780' | 'w1280' | 'original' = 'original'): string {
    if (!path) {
      return 'https://placehold.co/1280x720/0f172a/64748b?text=Sem+Imagem+de+Fundo';
    }
    // 🔥 Corrigido: Agora fica https://image.tmdb.org/t/p/original/imagem.jpg perfeito
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  getWatchTrailerUrl(movieId: number, language: string = 'pt-BR'): Observable<VideoResponse> {
    const endpoint = `${this.url}/movie/${movieId}/videos`;
    const params = new HttpParams().set('language', language);
    return this.http.get<VideoResponse>(endpoint, {  params });
  }

  
}