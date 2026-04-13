import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // localStorage es síncrono: evita esperar a Ionic Storage en la primera petición tras abrir la app.
    let syncToken: string | null = null;
    try {
      syncToken = localStorage.getItem('patient_token');
    } catch {
      /* entorno sin window */
    }
    if (syncToken) {
      return next.handle(
        req.clone({ setHeaders: { Authorization: `Bearer ${syncToken}` } })
      );
    }

    return from(this.storage.get('patient_token')).pipe(
      switchMap((token: string | null) => {
        if (token) {
          return next.handle(
            req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          );
        }
        return next.handle(req);
      })
    );
  }
}
