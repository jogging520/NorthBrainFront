import {Inject, Injectable} from '@angular/core';
import {_HttpClient, MenuService, SettingsService, TitleService} from "@delon/theme";
import {ACLService} from "@delon/acl";
import {CommonService} from "@shared/services/common.service";
import {environment} from "@env/environment";
import {of} from "rxjs/index";
import {catchError, map} from "rxjs/internal/operators";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs/Rx";
import {User} from "@shared/models/user";

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: _HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { }

  public initial(): void {
    const tokenData = this.tokenService.get();
    const roleId = tokenData.roleId;

    this.setStrategies();
    this.setMenu(roleId);
    this.setAcl(roleId);
  }

  public login(userName?: string, password?: string, mobile?: string): Observable<any> {
    if (userName && password) {
      return this.httpClient
        .post(
          `${environment.SERVER_URL}login?appType=${environment.appType}&userName=${userName}&password=${password}`,
          null,
          null)
        .pipe(map(data => {
            console.log(data);
            this.setParameters(data);
            return data;
        }),
          catchError(err => of(err))
        );
    } else if (mobile) {
      return this.httpClient
        .post(
          `${environment.SERVER_URL}login?appType=${environment.appType}&mobile=${mobile}`,
          null,
          null)
        .pipe(map(data => {
            console.log(data);
            this.setParameters(data);
            return data;
        }),
          catchError(err => of(err))
        );
    }
  }

  public logout() {
    this.purgeAuth();
  }

  private setStrategies(): void {
    this.httpClient
      .get(`${environment.SERVER_URL}strategies\\application`,
        null,
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(err => of(err))
      )
      .subscribe(
        strategy => {
          this.settingService.setApp(strategy.app);
          this.titleService.suffix = strategy.app.name;
        }
      );
  }

  private setMenu(roleId: string): void {
    this.httpClient
      .get(
        `${environment.SERVER_URL}menu\\${roleId}`,
        null,
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(err => of(err))
      )
      .subscribe(
        menu => this.menuService.add(menu)
      );
  }

  private setAcl(roleId: string): void {
    this.httpClient
      .get(
        `${environment.SERVER_URL}acl\\${roleId}`,
        null,
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(err => of(err))
      )
      .subscribe(
        acl => this.aclService.add(acl)
      )
  }

  private setParameters(data: any): void {
    this.httpClient
      .get(
        `${environment.SERVER_URL}users\\${data.userId}`,
        null,
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(err => of(err))
      )
      .subscribe(
        user => {
          this.tokenService.clear();

          this.tokenService.set({
            token: data.token,
            sessionId: data.sessionId,
            userId: data.userId,
            roleId: user.roleId,
            affiliations: user.affiliations,
            loginTime: new Date().getTime(),
            lifeTime: data.lifeTime
          });

          this.setAuth(user);
        }
      )
  }

  private setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private purgeAuth() {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}

