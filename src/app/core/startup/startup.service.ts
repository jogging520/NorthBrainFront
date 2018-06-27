import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import {Strategy} from "@shared/models/strategy";
import {MenuService, SettingsService, TitleService} from "@delon/theme";
import {ACLService} from "@delon/acl";
import {catchError, map, scan} from "rxjs/internal/operators";
import {environment} from "@env/environment";
import {CommonService} from "@shared/services/common.service";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs/index";
import {Role} from "@shared/models/role";
import {map} from "rxjs/operators";

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private injector: Injector,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private commonService: CommonService,
  ) { }

  private initial(resolve: any, reject: any) {
    const tokenData = this.tokenService.get();
    const currentTime = new Date().getTime();

    //如果没有登录或者已经超过登录时间，那么重定向到登录页面。
    if (!tokenData.token || currentTime - tokenData.loginTime > tokenData.lifeTime) {
      this.injector.get(Router).navigateByUrl('/passport/login');
      resolve({});
      return;
    }

    this.httpClient
      .get(`${environment.SERVER_URL}strategies\\application`,
        {headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'apikey': `${environment.apikey}`
        }}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      )
      .flatMap(strategy => strategy)
      .subscribe(
        (strategy: Strategy) => {
          this.settingService.setApp({name: strategy.parameters.name, description: strategy.parameters.description});
          this.titleService.suffix = strategy.parameters.name;
        }
      );

    this.httpClient
      .get(
        `${environment.SERVER_URL}menus\\${environment.appType}`,
        {headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'apikey': `${environment.apikey}`
        }}
      )
      .pipe(
        catchError(error => this.commonService.handleError(error))
      )
      .subscribe(
        menu => this.menuService.add(menu)
      );

    const roleIds = tokenData.roleIds;
    const permissionIds = tokenData.permissionIds;

    var params = {roleIds: roleIds.join(), appType: `${environment.appType}`};
    var abilities = permissionIds;

    this.httpClient
      .get(
        `${environment.SERVER_URL}privileges\\roles`,
        {headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'apikey': `${environment.apikey}`},
          params: params}
      )
      .pipe(
        flatMap(role => role),
        map((role: Role) => role.permissionIds),
        scan((ability, permissionId) => {
          for(let id in permissionId) {
            if(ability.indexOf(permissionId[id]) == -1)
              ability.push(permissionId[id]);
          }
          return ability;
          }, abilities),
        catchError(error => this.commonService.handleError(error))
      )
      .subscribe(
        () => {
          console.log(abilities);
          this.aclService.setAbility(abilities);
        }
      )

    resolve({});
  }



  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.initial(resolve, reject);
    });
  }
}
