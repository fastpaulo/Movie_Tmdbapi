import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  query,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FavoriteMovie } from '../interface/tmdb-movies';

@Injectable({
  providedIn: 'root' // <-- Esta é a única mudança estrutural que mantivemos, pois é obrigatória no Angular
})
export class Favorite {
  private firestore = inject(Firestore);

  async addFavorite(userId: string, movie: any): Promise<void> {
    const favoriteDocRef = doc(this.firestore, `user/${userId}/favorites/${movie.id}`);

    const movieData: FavoriteMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      addedAt: new Date() as any, // <-- Restaurado para o seu formato original
      userId: userId,
      overview: movie.overview
    };

    return await setDoc(favoriteDocRef, movieData);
  }

  // Mudei para aceitar string | number para evitar erros de tipagem
  async removeFavorite(userId: string, movieId: string | number): Promise<void> {
    const favoriteDocRef = doc(this.firestore, `user/${userId}/favorites/${movieId}`);
    return await deleteDoc(favoriteDocRef);
  }

  // <-- Restauramos o seu onSnapshot que funcionava perfeitamente!
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

      // Cancela o listener automaticamente
      return () => unsubscribe();
    });
  }
}