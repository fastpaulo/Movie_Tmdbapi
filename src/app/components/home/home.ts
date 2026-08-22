import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
private router = inject(Router);

}
