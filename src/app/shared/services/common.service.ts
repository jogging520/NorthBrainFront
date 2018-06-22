import { Injectable } from '@angular/core';
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs/Rx";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  public setHeaders(): HttpHeaders {
    const headersConfig = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      'apikey': `${environment.apikey}`
    };

    return new HttpHeaders(headersConfig);
  }

  public setParams(config: Object): HttpParams {
    const params: HttpParams = new HttpParams();

    Object.keys(config)
      .forEach((key) => {
        params.set(key, config[key]);
      });

    return params;
  }

  public formatErrors(error: any) {
    return Observable.throwError(error.jons());
  }
}
