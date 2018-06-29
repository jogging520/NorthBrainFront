import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import {Strategy} from "@shared/models/strategy";
import {MenuService, SettingsService, TitleService} from "@delon/theme";
import {ACLService} from "@delon/acl";
import {catchError, map, scan, flatMap} from "rxjs/operators";
import {environment} from "@env/environment";
import {CommonService} from "@shared/services/common.service";
import {HttpClient} from "@angular/common/http";
import {Role} from "@shared/models/role";
import {CacheService} from "@delon/cache";

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
    private cacheService: CacheService,
    private httpClient: HttpClient,
    private commonService: CommonService,
  ) { }

  private initial(resolve: any, reject: any) {
    const tokenData = this.tokenService.get();
    const currentTime = new Date().getTime();

    //1、如果没有登录或者已经超过登录时间，那么重定向到登录页面。
    if (!tokenData.token || currentTime - tokenData.loginTime > tokenData.lifeTime) {
      this.injector.get(Router).navigateByUrl('/passport/login');
      resolve({});
      return;
    }

    let headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'apikey': `${environment.apikey}`
      };

    //2、获取应用程序相关信息并设置
    this.httpClient
      .get(`${environment.SERVER_URL}strategies\\application`,
        {headers: headers}
      )
      .pipe(
        flatMap((strategy: any) => strategy),
        catchError(error => {
          resolve(null);
          return this.commonService.handleError(error)
        })
      )
      .subscribe(
        (strategy: Strategy) => {
          this.settingService.setApp({name: strategy.parameters.name, description: strategy.parameters.description});
          this.titleService.suffix = strategy.parameters.name;
        }
      );

    //3、获取错误码相关信息，并缓存
    this.httpClient
      .get(`${environment.SERVER_URL}strategies\\errorcode`,
        {headers: headers}
      )
      .pipe(
        flatMap((strategy: any) => strategy),
        catchError(error => {
          resolve(null);
          return this.commonService.handleError(error)
        })
      )
      .subscribe(
        (strategy: Strategy) => {
          this.cacheService.set('errorcode', strategy.parameters);
        }
      );

    //4、获取菜单相关信息并设置
    this.httpClient
      .get(
        `${environment.SERVER_URL}menus\\${environment.appType}`,
        {headers: headers}
      )
      .pipe(
        catchError(error => {
          resolve(null);
          return this.commonService.handleError(error)
        })
      )
      .subscribe(
        menu => this.menuService.add(menu)
      );

    //5、获取角色权限信息，并设置
    const roleIds = tokenData.roleIds;
    const permissionIds = tokenData.permissionIds;

    let params = {roleIds: roleIds.join(), appType: `${environment.appType}`};
    let abilities = permissionIds;

    this.httpClient
      .get(
        `${environment.SERVER_URL}privileges\\roles`,
        {headers: headers,
          params: params}
      )
      .pipe(
        flatMap((role: any) => role),
        map((role: Role) => role.permissionIds),
        scan((ability, permissionIds) => {
          for(let permissionId of permissionIds) {
            if(ability.indexOf(permissionId) == -1)
              ability.push(permissionId);
          }
          return ability;
          }, abilities),
        catchError(error => {
          resolve(null);
          return this.commonService.handleError(error)
        })
      )
      .subscribe(
        () => {
          this.aclService.setAbility(abilities);
          console.info(this.aclService.data);
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
