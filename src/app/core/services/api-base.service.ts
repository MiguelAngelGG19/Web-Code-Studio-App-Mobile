import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';

/** localStorage: URL base del backend, ej. http://192.168.0.5:3000 o …/api */
export const ACTIVA_API_BASE_LS = 'ACTIVA_API_BASE';

/**
 * Resuelve la raíz del API (termina en /api). Permite override en el dispositivo
 * y ajusta localhost → 10.0.2.2 en emulador Android.
 */
@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  get apiRoot(): string {
    let base = (environment.apiUrl || '').trim().replace(/\/$/, '');

    try {
      const manual = localStorage.getItem(ACTIVA_API_BASE_LS)?.trim();
      if (manual?.startsWith('http')) {
        const o = manual.replace(/\/$/, '');
        base = o.endsWith('/api') ? o : `${o}/api`;
      }
    } catch {
      /* sin localStorage */
    }

    if (!base.endsWith('/api')) {
      base = `${base}/api`;
    }

    try {
      const u = new URL(base);
      const platform = Capacitor.isNativePlatform()
        ? Capacitor.getPlatform()
        : 'web';

      // Navegador / ionic serve: 10.0.2.2 no existe en el PC
      if (platform === 'web' && u.hostname === '10.0.2.2') {
        u.hostname = 'localhost';
        base = u.toString().replace(/\/$/, '');
      }

      // iOS (simulador): mismo trato que web para el host
      if (platform === 'ios' && u.hostname === '10.0.2.2') {
        u.hostname = 'localhost';
        base = u.toString().replace(/\/$/, '');
      }

      // Android nativo: el emulador llega al PC con 10.0.2.2
      if (platform === 'android') {
        if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
          u.hostname = '10.0.2.2';
          base = u.toString().replace(/\/$/, '');
        }
      }
    } catch {
      /* URL inválida */
    }

    return base;
  }

  setManualBase(url: string): void {
    const t = url.trim();
    if (!t.startsWith('http')) {
      return;
    }
    localStorage.setItem(ACTIVA_API_BASE_LS, t);
  }

  clearManualBase(): void {
    localStorage.removeItem(ACTIVA_API_BASE_LS);
  }
}
