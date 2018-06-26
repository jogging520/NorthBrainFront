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
    const permissionIds = tokenData.permissionIds;

    this.setStrategies();
    this.setMenus();
    this.setPrivileges(roleId, permissionIds);
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

  /**
   * 方法：设置策略，包括应用系统信息、
   */
  private setStrategies(): void {
    this.httpClient
      .get(`${environment.SERVER_URL}strategies\\application`,
        {params: null},
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      )
      .subscribe(
        strategy => {
          this.settingService.setApp(strategy.app);
          this.titleService.suffix = strategy.app.name;
        }
      );
  }

  /**
   * 方法：设置菜单
   */
  private setMenus(): void {
    this.httpClient
      .get(
        `${environment.SERVER_URL}menus\\${environment.appType}`,
        {params: null},
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      )
      .subscribe(
        menu => this.menuService.add(menu)
      );
  }

  /**
   * 方法：设置各类参数，包括token、当前用户和角色权限等。
   * @param data 登录后返回的session数据
   */
  private setParameters(data: any): void {
    this.httpClient
      .get(
        `${environment.SERVER_URL}users\\${data.userId}`,
        {params: null},
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      )
      .subscribe(
        user => {
          //1、设置token
          this.tokenService.clear();

          this.tokenService.set({
            token: data.token,
            sessionId: data.sessionId,
            userId: data.userId,
            roleIds: user.roleIds,
            permissionIds: user.permissionIds,
            affiliations: user.affiliations,
            loginTime: new Date().getTime(),
            lifeTime: data.lifeTime
          });

          //2、发射用户
          this.setAuth(user);
        }
      )
  }

  private setPrivileges(roleIds: string[], permissionIds: number[]): void {
    var params = {roleIds: roleIds, appType: `${environment.appType}`};
    var abilities = permissionIds;

    this.httpClient
      .get(
        `${environment.SERVER_URL}privileges\\roles`,
        {params: params},
        {headers: this.commonService.setHeaders()}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      )
      .scan((role, ability) => ability.concat(role.permissionIds), abilities)
      .subscribe(
        () => this.aclService.setAbility(abilities)
      )
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

