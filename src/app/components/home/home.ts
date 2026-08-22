import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  auth = inject(Auth);
  name = JSON.parse(sessionStorage.getItem('user') || '{}').name;
  imageProfile = JSON.parse(sessionStorage.getItem('user') || '{}').picture;
  email = JSON.parse(sessionStorage.getItem('user') || '{}').email;
  signOut() {
    sessionStorage.removeItem('user');
    this.auth.signOut();
  }
}
