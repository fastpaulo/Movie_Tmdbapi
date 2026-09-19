import { inject } from '@angular/core'; // 🔥 Importação corrigida
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // Se existe um usuário no sessionStorage, permite a passagem
  if (sessionStorage.getItem('user')) {
    return true;
  }
  
  // Se não existe, redireciona para a tela de login (raiz '/')
 return router.parseUrl('/login');
};