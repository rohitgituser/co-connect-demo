import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

export const paginationMaxSize: number = 5

export interface IError {
    code: number,
    message: string
}

export const handleError = (error: HttpErrorResponse) => {
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
        console.log(error)
    }

    return throwError(unKnownError)
}

export const getHeadersForApp = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTk2YTU2ZjEzZWQxNDRmOWEzYWJhMTUiLCJmaXJzdE5hbWUiOiJSb2hpdCIsImxhc3ROYW1lIjoiRyIsImVtYWlsIjoiZ2Fpa3JvLWNvbnRAbWFoaW5kcmEuY29tIiwiaWF0IjoxNTg3NDQyMzM1LCJleHAiOjE1ODc0NDIzNjN9.-jRasRy23t3WH7vlEoYABwnBu_G-HJ91m7wQ-z_Jj7o',
        User: '5e96a56f13ed144f9a3aba15'
    })
}

export const getAuthorizedHeaders = (Authorization: string, User: string, contentType?: string) => {
    return {
        headers: new HttpHeaders({
            'Content-Type': contentType ? contentType : 'application/json',
            Authorization,
            User
        })
    }
}

export const getHeaders = (contentType?: string) => {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    return {
        headers: new HttpHeaders({
            'Content-Type': contentType ? contentType : 'application/json',
            Authorization: 'Bearer ' + currentUser.token,
            User: currentUser._id
        })
    }
}
export const getHeadersWithNoContentType = (contentType?: string) => {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    return {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + currentUser.token,
            User: currentUser._id
        })
    }
}

export const checkIfNull = (value) => {
    return undefined === value || null === value || '' === value
}

