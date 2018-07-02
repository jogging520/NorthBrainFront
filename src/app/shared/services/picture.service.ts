import { Injectable } from '@angular/core';
import {CommonService} from "@shared/services/common.service";
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/Rx";
import {Picture} from "@shared/models/picture";
import {environment} from "@env/environment";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  public queryPictureById(pictureId: string): Observable<Picture> {
    return this.httpClient
      .get(`${environment.SERVER_URL}storage\\pictures\\${pictureId}`,
        this.commonService.setParams({}),
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
}
