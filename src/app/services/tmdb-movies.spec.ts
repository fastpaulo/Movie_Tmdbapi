import { TestBed } from '@angular/core/testing';
import { TmdbMovies } from './tmdb-movies';

describe('TmdbMovies', () => {
  let service: TmdbMovies;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbMovies);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
