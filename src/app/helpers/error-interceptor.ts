import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { IError } from '../utilities/common';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService){

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {
            if ([401, 403].indexOf(error.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this.authService.logout();
                location.reload(true);
            }

            let unKnownError: IError = {
                code: 0,
                message: 'Unexpected Error Occurred'
            }
        
            //Client side errors - such network issues and JavaScript syntax and type errors
            if (error instanceof ErrorEvent) {
                unKnownError.code = 1
                unKnownError.message = error.error.message
            }
            //Server side errors - such as code errors in the server and database access errors
            else if (error instanceof HttpErrorResponse) {
                unKnownError.code = error.error.status
                unKnownError.message = error.error.message
            }
            else {
        
            }
        
            return throwError(unKnownError)
        }))
    }

}