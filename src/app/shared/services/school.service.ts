import { Injectable } from '@angular/core';
import {CommonService} from "@shared/services/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/Rx";
import {School} from "@shared/models/school";
import {environment} from "@env/environment";
import {catchError} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  public querySchoolsByRegionIds(regionIds: string[]): Observable<School[]> {
    return this.httpClient
      .get(`${environment.SERVER_URL}schools`,
        this.commonService.setParams({regionIds: regionIds}),
        {headers: this.commonService.setHeaders()}
        )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
}
