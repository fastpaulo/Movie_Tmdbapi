import {Service, Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  collectionData 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FavoriteMovie } from '../interface/tmdb-movies';

@Service()
export class Favorite {
private firestore = inject(Firestore);
async addFavorite(userId: string, movie: any): Promise<void> {
   
    const favoriteDocRef = doc(this.firestore, `user/${userId}/favorites/${movie.id}`);

    const movieData: FavoriteMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      addedAt: new Date(),
      userId: userId
    };

    return await setDoc(favoriteDocRef, movieData);
  }

 
  async removeFavorite(userId: string, movieId: number): Promise<void> {
    const favoriteDocRef = doc(this.firestore, `user/${userId}/favorites/${movieId}`);
    return await deleteDoc(favoriteDocRef);
  }


  getFavorites(userId: string): Observable<FavoriteMovie[]> {
    const favoritesCollection = collection(this.firestore, `users/${userId}/favorites`);
    return collectionData(favoritesCollection, { idField: 'docId' }) as Observable<FavoriteMovie[]>;
  }
}
