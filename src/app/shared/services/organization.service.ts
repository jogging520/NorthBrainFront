import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {CommonService} from "@shared/services/common.service";
import {Option} from "@shared/models/option";
import {Observable} from "rxjs/Rx";
import {Organization} from "@shared/models/organization";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  path: string[] = [];

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  public queryOrganizations(code: string): Observable<Option> {
    return this.httpClient.get(
      `${environment.SERVER_URL}organizations`,
      null,
      {headers: this.commonService.setHeaders()})
      .flatMap(organization => organization)
      .map((organization: Organization) => this.locate(organization, code))
      .map((organization: Organization) => this.transform(organization));
  }

  private locate(organization: Organization, code: string): Organization {
    if(organization.code === code)
      return organization;

    var org: Organization;

    if (organization.children) {
      for (var child of organization.children) {
        org = this.locate(child, code);

        if (org)
          return org;
      }
    }

    return null;
  }

  private transform(organization: Organization): Option {

    if(!organization)
      return null;

    var option: any = new Option();

    option.value = organization.code;
    option.label = organization.name;

    if (organization.children == null) {
      option.isLeaf = true;

      return option;
    }

    if (organization.children) {
      for (var child of organization.children) {
        option.children.push(this.transform(child));
      }
    }

    return option;
  }
}
