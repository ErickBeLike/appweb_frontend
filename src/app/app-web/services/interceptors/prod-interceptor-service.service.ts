import { AuthService } from '../authentication/auth.service';
import { JwtDto } from '../../models/jwt-dto';
import { catchError, concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenService } from '../authentication/token.service';

const AUTHORIZATION = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorServiceService implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.tokenService.isLogged()) {
      return next.handle(req);
    }

    const token = this.tokenService.getToken();
    
    if (token) {
      const intReq = this.addToken(req, token);

      return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => this.handleError(err, req, next)));
    } else {
      return throwError('Token is null');
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ headers: req.headers.set(AUTHORIZATION, 'Bearer ' + token) });
  }

  private handleError(err: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (err.status === 401) {
      const token = this.tokenService.getToken();
      if (token) {
        const dto: JwtDto = new JwtDto(token);
        return this.authService.refresh(dto).pipe(concatMap((data: any) => {
          console.log('refrescando token....');
          this.tokenService.setToken(data.token);
          return next.handle(this.addToken(req, data.token));
        }));
      } else {
        return throwError('Token is null');
      }
    } else if (err.status === 403) {
      this.tokenService.logOut();
      return throwError(err);
    } else {
      return throwError(err);
    }
  }
}

export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorServiceService, multi: true }];
