import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getCookie } from 'typescript-cookie'


export function sessionInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>>
{
  const cook =getCookie('csrftoken')
  let headers = req.headers
  if (cook){
    headers = headers.append('X-CSRFToken', cook)
  }
  const newReq = req.clone({
    withCredentials: true,
    headers: headers,
  });
  return next(newReq);
};

