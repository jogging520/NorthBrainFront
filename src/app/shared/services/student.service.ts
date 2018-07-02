import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs/Rx";
import {CommonService} from "@shared/services/common.service";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient: _HttpClient,
              private commonService: CommonService
  ) { }

  public listing(regionIds: string[]): Observable<any[]> {
    return this.httpClient.get(
      `${environment.SERVER_URL}\students`,
      this.commonService.setParams({regionIds: regionIds}),
      {headers: this.commonService.setHeaders()}
    );
  }

  public save(body?: any): Observable<any> {
    return this.httpClient.post(
      `${environment.SERVER_URL}\student`,
      body,
      null
    )
  }
}
