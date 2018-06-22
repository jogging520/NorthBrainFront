import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {Observable} from "rxjs/Rx";
import {Region} from "@shared/models/region";
import {environment} from "@env/environment";
import {Option} from "@shared/models/option";
import {CommonService} from "@shared/services/common.service";

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  public queryAllRegions(): Observable<Option> {
    return this.httpClient.get(
      `${environment.SERVER_URL}regions`,
      null,
      {headers: this.commonService.setHeaders()})
      .flatMap(region => region)
      .map((region: Region) => this.transform(region));

  }

  private transform(region: Region): Option {

      var option: any = new Option();

      option.value = region.code;
      option.label = region.name;
      if(region.level === 'COUNTY') {
        option.isLeaf = true;

        return option;
      }

      console.log(region);
      console.log(region.code);

      if(region.children) {
        for (var child of region.children) {
          option.children.push(this.transform(child));
        }
      }




    //region.children
    //  .forEach(r => option.children.push(this.transform(r)));

    return option;
  }
}
