import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { Challenge } from '../../core/models/challenge';
import { Home } from './home';

const sample: Challenge[] = [
  {
    id: 'junior-01-routing',
    level: 'junior',
    belt: 'blanco',
    order: 1,
    title: 'Router: pantalla en blanco',
    topic: 'Router',
    tags: ['router'],
    failureModes: ['pantalla en blanco'],
    symptom: 'pantalla en blanco',
    timeMinutes: 30,
    bugs: 5,
    verify: { unit: true, e2e: true, build: false },
    status: 'ready',
    shortSlug: 'routing',
    branch: { challenge: 'challenge/junior/routing', solution: 'solution/junior/routing' },
  },
];

describe('Home', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('pinta el catálogo agrupado por cinturón', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    TestBed.inject(HttpTestingController).expectOne('challenges.json').flush(sample);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Router: pantalla en blanco');
    expect(text).toContain('pantalla en blanco');
  });

  it('avisa cuando el catálogo está vacío', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    TestBed.inject(HttpTestingController).expectOne('challenges.json').flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Todavía no hay retos publicados');
  });
});
