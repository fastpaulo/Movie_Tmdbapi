import {Service, Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  collectionData, 
  query,
  onSnapshot
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
      userId: userId,
      overview: movie.overview

    };

    return await setDoc(favoriteDocRef, movieData);
  }

 
  async removeFavorite(userId: string, movieId: number): Promise<void> {
    const favoriteDocRef = doc(this.firestore, `user/${userId}/favorites/${movieId}`);
    return await deleteDoc(favoriteDocRef);
  }


  getFavorites(userId: string): Observable<FavoriteMovie[]> {
    const favoritesCollection = collection(this.firestore, `user/${userId}/favorites`);
  const q = query(favoritesCollection);

  return new Observable<FavoriteMovie[]>((observer) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as FavoriteMovie[];
        
        observer.next(data);
      },
      (error) => observer.error(error)
    );

    // Cancela o listener automaticamente quando a inscrição for destruída
    return () => unsubscribe();
  });
  }
}
