declare var google: any;
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class Auth {
    router = inject(Router);

    signOut() {
        google.accounts.id.disableAutoSelect();
        this.router.navigate(['/']);
    }
}
