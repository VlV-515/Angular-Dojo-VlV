import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../src/app/app.routes';
import { TecnicasDetail } from '../src/app/features/junior-01-routing/tecnicas-detail';

describe('Rutas de técnicas (junior-01-routing)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter(routes)],
    });
  });

  it('/tecnicas activa la lista', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tecnicas');
    const root = harness.routeNativeElement;
    expect(root?.textContent).toContain('Técnicas del dojo');
    expect(root?.querySelector('ul')).toBeTruthy();
  });

  it('/tecnicas/:id activa el detalle, no la lista', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tecnicas/mae-geri');
    const root = harness.routeNativeElement;
    expect(root?.querySelector('ul')).toBeFalsy();
  });
});

describe('TecnicasDetail (componente aislado)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('muestra la técnica que corresponde al id recibido', () => {
    const fixture = TestBed.createComponent(TecnicasDetail);
    fixture.componentRef.setInput('id', 'mae-geri');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Mae geri');
    expect(text).not.toContain('Kihon dachi');
  });
});
