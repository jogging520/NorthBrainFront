import { Injectable } from '@angular/core';
import {CommonService} from "@shared/services/common.service";
import {_HttpClient, Menu} from "@delon/theme";
import {Observable} from "rxjs/Rx";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class WebMenuService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  public queryMenus(appType: string, roleId: string): Observable<Menu[]> {
    return this.httpClient.get(`${environment.SERVER_URL}\\menus`,
      this.commonService.setParams({'appType': appType, 'roleId': roleId}),
      {headers: this.commonService.setHeaders()}
      )
      .catch(this.commonService.formatErrors);
  }
}
