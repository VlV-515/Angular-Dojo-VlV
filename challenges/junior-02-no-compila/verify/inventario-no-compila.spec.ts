import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { InventarioList } from '../src/app/features/junior-02-no-compila/inventario-list';

describe('InventarioList (smoke, junior-02-no-compila)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('compila y renderiza la lista de inventario', () => {
    const fixture = TestBed.createComponent(InventarioList);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Inventario del dojo');
    expect(text).toContain('Karategi talla M');
  });
});
