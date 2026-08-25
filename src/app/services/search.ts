import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

@Service()
export class Search {
    private http = inject(HttpClient);
  private baseUrl = 'https://api.themoviedb.org/3';
private apiKey = environment.KeyapiTmdb;

searchMovies(queryText: string, page: number = 1): Observable<any> {
    if (!queryText.trim()) {
      return of({ results: [] });
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('query', queryText.trim())
      .set('page', page.toString())
      .set('include_adult', 'false');

    return this.http.get(`${this.baseUrl}/search/movie`, { params });
  }

}
