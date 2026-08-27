import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesFavorites } from './movies-favorites';

describe('MoviesFavorites', () => {
  let component: MoviesFavorites;
  let fixture: ComponentFixture<MoviesFavorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesFavorites],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesFavorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
