import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from "@angular/router";
import {of} from "rxjs/index";
import {Observable} from "rxjs/Rx";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public messageService: NzMessageService,
    private router: Router
  ) { }

  public setHeaders(): HttpHeaders {
    const headersConfig = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      'apikey': `${environment.apikey}`
    };

    return new HttpHeaders(headersConfig);
  }

  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log(this);
    switch (error.status) {
      case 200:
        break;
      case 401:
        this.router.navigate(['/passport/login']);
        break;
      default:
        console.warn("系统调用服务发生未可知错误，可能是后端问题。", error);
        this.messageService.error("系统调用服务发生未可知错误，可能是后端问题。");
        break;
    }

    return of(error);
  }
}
