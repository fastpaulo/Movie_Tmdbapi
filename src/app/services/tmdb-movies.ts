import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { TmdbSearchResponse, VideoResponse } from '../interface/tmdb-movies';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where
} from '@angular/fire/firestore';
export interface FirebaseMovie {
    tmdbId: number;
    title: string;
    posterPath: string | null;
    status: 'watched' | 'to_watch';
    userRating?: number;
    addedAt: string;
    watchedAt?: string;
}
@Service()
export class TmdbMovies {
    private firestore = inject(Firestore);
    private http = inject(HttpClient);
    url = environment.tmdbBaseUrl;
    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.tokenApi}`
    });
    imageBaseUrl = 'https://image.tmdb.org/t/p/';
    searchMovies(query: string, page: number = 1): Observable<TmdbSearchResponse> {
    // ⚠️ Corrigido o endpoint para /search/movie (estava /search/ )
    const url = `${environment.tmdbBaseUrl}/search/movie`;
    
    // 1. Parâmetros em Português (Principal)
    const paramsPt = new HttpParams()
        .set('query', query)
        .set('language', 'pt-BR')
        .set('page', page.toString());

    // 2. Parâmetros em Inglês (Reserva/Fallback)
    const paramsEn = new HttpParams()
        .set('query', query)
        .set('language', 'en-US')
        .set('page', page.toString());

    // 3. Executa as duas chamadas simultaneamente
    return forkJoin({
        ptData: this.http.get<TmdbSearchResponse>(url, { headers: this.headers, params: paramsPt }),
        enData: this.http.get<TmdbSearchResponse>(url, { headers: this.headers, params: paramsEn })
    }).pipe(
        map(({ ptData, enData }) => {
            // Percorre os resultados em pt-BR
            ptData.results = ptData.results.map((movie, index) => {
                // Se a descrição estiver vazia, substitui pela descrição em inglês do mesmo índice
                if (!movie.overview || movie.overview.trim() === '') {
                    // Verificação de segurança caso as listas tenham tamanhos diferentes (raro, mas possível no TMDB)
                    if (enData.results[index]) {
                        movie.overview = enData.results[index].overview;
                    }
                }
                return movie;
            });
            
            // Retorna o objeto em português atualizado
            return ptData; 
        })
    );
}
    getPopularMovies(page: number = 1): Observable<TmdbSearchResponse> {
        const url = `${environment.tmdbBaseUrl}/movie/popular`;

        // 1. Parâmetros em Português (Principal)
        const paramsPt = new HttpParams()
            .set('language', 'pt-BR')
            .set('page', page.toString());

        // 2. Parâmetros em Inglês (Reserva/Fallback)
        const paramsEn = new HttpParams()
            .set('language', 'en-US')
            .set('page', page.toString());

        // 3. Executa as duas chamadas ao mesmo tempo
        return forkJoin({
            ptData: this.http.get<TmdbSearchResponse>(url, { headers: this.headers, params: paramsPt }),
            enData: this.http.get<TmdbSearchResponse>(url, { headers: this.headers, params: paramsEn })
        }).pipe(
            map(({ ptData, enData }) => {
                // Percorre os filmes em pt-BR
                ptData.results = ptData.results.map((movie, index) => {
                    // Se a descrição estiver vazia, substitui pela descrição em inglês do mesmo índice
                    if (!movie.overview || movie.overview.trim() === '') {
                        movie.overview = enData.results[index].overview;
                    }
                    return movie;
                });

                // Retorna o objeto em português atualizado
                return ptData;
            })
        );
    }
    getMovieDetails(movieId: number): Observable<any> {
    const url = `${environment.tmdbBaseUrl}/movie/${movieId}`;
    
    // Parâmetro padrão em Português
    const paramsPt = new HttpParams().set('language', 'pt-BR');

    return this.http.get<any>(url, { headers: this.headers, params: paramsPt }).pipe(
        switchMap(moviePt => {
            // Se o filme já tem a sinopse em português, apenas retorna ele mesmo (não faz nova chamada)
            if (moviePt.overview && moviePt.overview.trim() !== '') {
                return of(moviePt);
            }

            // Se não tem sinopse, fazemos uma nova requisição em inglês
            const paramsEn = new HttpParams().set('language', 'en-US');
            
            return this.http.get<any>(url, { headers: this.headers, params: paramsEn }).pipe(
                map(movieEn => {
                    // Pega a sinopse em inglês e coloca no objeto que já tínhamos
                    moviePt.overview = movieEn.overview;
                    
                    // Retorna o filme em português, mas com a sinopse "emprestada" do inglês
                    return moviePt;
                })
            );
        })
    );
}
    saveMovie() {

    }
    getBackdropUrl(
        path: string | null | undefined,
        size: 'w300' | 'w780' | 'w1280' | 'original' = 'original'
    ): string {
        if (!path) {
            // Imagem padrão caso o filme não possua backdrop no TMDB
            return 'https://placehold.co/1280x720/0f172a/64748b?text=Sem+Imagem+de+Fundo';
        }

        return `${this.imageBaseUrl}/${size}${path}`;
    }

    getWatchTrailerUrl(movieId: number, language: string = 'pt-BR'): Observable<VideoResponse> {
        const url = `${environment.tmdbBaseUrl}/movie/${movieId}/videos`;
        const params = new HttpParams()
            .set('language', language);
        return this.http.get<VideoResponse>(url, { headers: this.headers, params });
    }
    getMyMovies(userId: string): Observable<FirebaseMovie[]> {
        const moviesCollection = collection(this.firestore, 'user', userId, 'movies');
        return collectionData(moviesCollection, { idField: 'tmdbId' }) as Observable<FirebaseMovie[]>;
    }
}
