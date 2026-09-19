import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const tmdbInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Verifica se a requisição está indo para a API do TMDB
  // Isso evita vazar o seu Token para outras APIs (como o Firebase)
  if (req.url.startsWith(environment.tmdbBaseUrl)) {
    
    // 2. Clona a requisição original adicionando os cabeçalhos (Headers)
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.tokenApi}`,
        'Content-Type': 'application/json'
      }
    });

    // 3. Libera a requisição modificada para seguir viagem
    return next(authReq);
  }

  // 4. Se a requisição não for pro TMDB, deixa ela passar sem alterar nada
  return next(req);
};