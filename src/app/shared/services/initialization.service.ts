import {Inject, Injectable, Optional} from '@angular/core';
import {_HttpClient, SettingsService} from "@delon/theme";
import {CommonService} from "@shared/services/common.service";
import {environment} from "@env/environment";
import {mergeMap, catchError, map} from "rxjs/operators";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {BehaviorSubject, ReplaySubject} from "rxjs/Rx";
import {User} from "@shared/models/user";
import {Token} from "@shared/models/token";
import {ReuseTabService} from "@delon/abc";
import {StartupService} from "@core/startup/startup.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private httpClient: _HttpClient,
    private router: Router,
    private commonService: CommonService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    private startupService: StartupService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private settingService: SettingsService
  ) { }

  public login(userName?: string, password?: string, mobile?: string): void {
    this.httpClient
      .post(
        `${environment.SERVER_URL}login`,
        null,
        {appType: environment.appType, userName: userName, password: password})
      .pipe(
        map((session: Token) => {
          this.tokenService.set({
            token: session.jwt
          });

          return session;
        }),
        mergeMap((session: Token) => {
          return this.httpClient
            .get(
              `${environment.SERVER_URL}users`,
              {userId: session.userId},
              {headers: this.commonService.setHeaders()}
            )
            .pipe(
              map(user => {
                this.tokenService.clear();

                this.tokenService.set({
                  token: session.jwt,
                  sessionId: session.sessionId,
                  userId: session.userId,
                  loginTime: new Date().getTime(),
                  lifeTime: session.lifeTime,
                  roleIds: user.roleIds,
                  permissionIds: user.permissionIds,
                  affiliations: user.affiliations
                });

                this.settingService.setUser({
                  name: user.realName,
                  avatar: user.avatar,
                  email: user.emails[0]});

                this.setAuth(user);
              }),
              catchError(error => this.commonService.handleError(error))
            )
        }),
        catchError(error => this.commonService.handleError(error))
      )
      .subscribe(
        () => {
          this.reuseTabService.clear();

          this.startupService.load().then(() => this.router.navigate(['/']));
        }
      )
  }

  public logout() {
    this.purgeAuth();
  }

  /**
   * 方法：设置鉴权信息
   * @param {User} user
   */
  private setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * 方法：清理鉴权信息
   */
  private purgeAuth() {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}

