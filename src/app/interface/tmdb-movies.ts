export interface TmdbMovies {

    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    date: string;
}
export interface TmdbSearchResponse {
    page: number;
    results: TmdbMovies[];
    total_pages: number;
    total_results: number;
}
export type MovieStatus = 'watched' | 'to_watch';

export interface TrackerMovie extends TmdbMovies {
    status: MovieStatus;
    userRating?: number;
    watchedAt?: string;
    addedAt: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  tagline?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime?: number;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
}

export interface MovieVideo {
  id: string;
  key: string;        
  name: string;       
  site: string;       
  type: string;       
  official: boolean;
}

export interface VideoResponse {
  id: number;
  results: MovieVideo[];
}

export interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: Date;
  userId: string;
}