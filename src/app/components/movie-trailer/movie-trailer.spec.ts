import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieTrailer } from './movie-trailer';

describe('MovieTrailer', () => {
  let component: MovieTrailer;
  let fixture: ComponentFixture<MovieTrailer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieTrailer],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieTrailer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
