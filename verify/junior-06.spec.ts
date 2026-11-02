import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { mockApiInterceptor } from '../src/app/core/mock-api/mock-api.interceptor';
import { FichaTecnica } from '../src/app/features/junior-06-http-resource/ficha-tecnica';

// httpResource registra la carga como una "pending task" de Angular, así que
// `fixture.whenStable()` espera lo que haga falta (la latencia real del mock, 200-260ms) sin
// necesidad de temporizadores simulados ni de esperas fijas -- igual que en home.spec.ts.
function botonConTexto(fixture: { nativeElement: HTMLElement }, texto: string): HTMLButtonElement {
  const botones = Array.from(fixture.nativeElement.querySelectorAll('button'));
  const boton = botones.find((b) => b.textContent?.includes(texto));
  if (!boton) {
    throw new Error(`No encontré un botón con texto "${texto}"`);
  }
  return boton;
}

describe('FichaTecnica (junior-06-http-resource)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(withFetch(), withInterceptors([mockApiInterceptor])),
      ],
    });
  });

  it('al elegir otra ficha, el contenido mostrado cambia a la técnica elegida', async () => {
    const fixture = TestBed.createComponent(FichaTecnica);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    let texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Zenkutsu dachi');

    botonConTexto(fixture, 'Gyaku zuki').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Gyaku zuki');
    expect(texto).not.toContain('Postura larga hacia adelante');
  });

  it('si la ficha pedida no existe, se ve un mensaje de error en vez de quedar en blanco', async () => {
    const fixture = TestBed.createComponent(FichaTecnica);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    botonConTexto(fixture, 'Kata fantasma').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const texto = ((fixture.nativeElement as HTMLElement).textContent ?? '').toLowerCase();
    expect(texto).toMatch(/no se pudo cargar|error/);
  });

  it('"Reintentar" vuelve a pedir los datos (dispara una nueva petición)', async () => {
    const fixture = TestBed.createComponent(FichaTecnica);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const antes = (fixture.nativeElement as HTMLElement).textContent ?? '';
    const consultasAntes = Number(/Consultada (\d+) veces/.exec(antes)?.[1]);
    expect(Number.isFinite(consultasAntes)).toBe(true);

    botonConTexto(fixture, 'Reintentar').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const despues = (fixture.nativeElement as HTMLElement).textContent ?? '';
    const consultasDespues = Number(/Consultada (\d+) veces/.exec(despues)?.[1]);
    expect(consultasDespues).toBeGreaterThan(consultasAntes);
  });
});
