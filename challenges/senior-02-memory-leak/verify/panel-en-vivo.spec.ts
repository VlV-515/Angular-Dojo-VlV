import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  PanelEnVivo,
  recursosAbiertos,
} from '../src/app/features/senior-02-memory-leak/panel-en-vivo';

describe('PanelEnVivo (senior-02-memory-leak)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('no deja listeners, subscripciones ni efectos vivos tras crear y destruir 20 veces', async () => {
    const antes = { ...recursosAbiertos };

    for (let i = 0; i < 20; i += 1) {
      const fixture = TestBed.createComponent(PanelEnVivo);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.destroy();
    }

    expect(recursosAbiertos.listeners).toBe(antes.listeners);
    expect(recursosAbiertos.subscripciones).toBe(antes.subscripciones);
    expect(recursosAbiertos.efectos).toBe(antes.efectos);
  });
});
