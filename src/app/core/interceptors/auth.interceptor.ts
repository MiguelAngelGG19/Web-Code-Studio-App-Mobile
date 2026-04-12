import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SessionService } from '../services/session.service';

/**
 * Interceptor de autenticación.
 * Lee el token desde SessionService (que ya inicializa el Storage en AppComponent)
 * y lo inyecta como header Authorization en cada petición HTTP.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private session: SessionService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.session.getToken()).pipe(
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
