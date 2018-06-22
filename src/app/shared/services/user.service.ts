import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs/Rx";
import {environment} from "@env/environment";
import {User} from "@shared/models/user";
import {CommonService} from "@shared/services/common.service";
import {catchError, map} from "rxjs/internal/operators";
import {of} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private httpClient: _HttpClient,
    private commonService: CommonService
  ) { }

  private formatErrors(error: any) {
    return Observable.throwError(error);
  }

  public login(userName?: string, password?: string, mobile?: string): Observable<any> {
    console.log(`------${userName}------${password}-------${mobile}`);
    if (userName && password) {
      console.log(`------${userName}------${password}-------${mobile}`);
      return this.httpClient
        .post(
          `${environment.SERVER_URL}login?appType=${environment.appType}&userName=${userName}&password=${password}`,
          null,
          null)
        .pipe(map(data => {
          console.log(data);
          return data;}),
          catchError(err => of(err))
          );
    } else if (mobile) {
      return this.httpClient
        .post(
          `${environment.SERVER_URL}login?appType=${environment.appType}&mobile=${mobile}`,
          null,
          null)
        .catch(this.formatErrors);
    }
  }

  public logout() {
    this.purgeAuth();
  }

  private setAuth(user: User) {
    console.log(user.userName);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private purgeAuth() {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  public queryUser(userId: string): void {
    this.httpClient.get(
      `${environment.SERVER_URL}users\\${userId}`,
      null,
      {headers: this.commonService.setHeaders()}
    )
      .subscribe(user => {
        this.setAuth(user);
      });
  }

  public queryTest(): Observable<any> {
    return this.httpClient.get(
      `${environment.SERVER_URL}test`,
      null,
      {headers: this.commonService.setHeaders()}
    )
      .pipe(map(data => {
          console.log(data);
          return data;}),
        catchError(err => of(err))
      );
  }
}
