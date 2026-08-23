import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
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
    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.tokenApi}`
    });
    imageBaseUrl = 'https://image.tmdb.org/t/p/';
    searchMovies(query: string, page: number = 1): Observable<TmdbSearchResponse> {
        const url = `${environment.tmdbBaseUrl}/search/movie`;
        const params = new HttpParams()
            // .set('api_key', environment.KeyapiTmdb)
            .set('query', query)
            .set('language', 'pt-BR')
            .set('page', page.toString());

        return this.http.get<TmdbSearchResponse>(url, { headers: this.headers, params });
    }
    getPopularMovies(page: number = 1): Observable<TmdbSearchResponse> {
        const url = `${environment.tmdbBaseUrl}/movie/popular`;
        const params = new HttpParams()
            .set('language', 'pt-BR')
            // .set('api_key', environment.KeyapiTmdb)
            .set('page', page.toString());
        console.log('URL da requisição:', url);
        return this.http.get<TmdbSearchResponse>(url, { headers: this.headers, params });
    }
    getMovieDetails(movieId: number): Observable<any> {
        const url = `${environment.tmdbBaseUrl}/movie/${movieId}`;
        const params = new HttpParams()
            .set('language', 'pt-BR');
        // .set('api_key', environment.KeyapiTmdb);
        return this.http.get<any>(url, { headers: this.headers, params });
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

    getWatchTrailerUrl(movieId: number, language: string = 'pt-BR'):  Observable<VideoResponse> {
        const url = `${environment.tmdbBaseUrl}/movie/${movieId}/videos`;
        const params = new HttpParams()
            .set('language', language);
        return this.http.get<VideoResponse>(url, { headers: this.headers, params });
    }

}

