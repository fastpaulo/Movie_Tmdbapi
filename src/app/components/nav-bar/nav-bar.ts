import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  imports: [],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {
  auth = inject(Auth);
  name = JSON.parse(sessionStorage.getItem('user') || '{}').name;
  imageProfile = JSON.parse(sessionStorage.getItem('user') || '{}').picture;
  email = JSON.parse(sessionStorage.getItem('user') || '{}').email;

  
  signOut() {
    sessionStorage.removeItem('user');
    this.auth.signOut();
  }
}
