import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},

        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (
              err.status === 403 ||
              (err.status === 500 && err.error.showGlobalErrorPage) ||
              (err.status === 500 &&
                err.error.parameters &&
                err.error.parameters.showGlobalErrorPage) ||
              err.status === 401
            ) {
              alert(1);
            }
          }
        }
      )
    );
  }
}
