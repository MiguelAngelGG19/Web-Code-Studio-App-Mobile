import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Storage ya fue inicializado en AppComponent.ngOnInit().
    // Aquí solo leemos el token, sin llamar storage.create() que podría
    // devolver null temporalmente y causar peticiones sin Authorization.
    return from(this.storage.get('patient_token')).pipe(
      switchMap((token: string | null) => {
        if (token) {
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
