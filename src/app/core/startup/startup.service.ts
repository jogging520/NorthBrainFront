import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import {InitializationService} from "@shared/services/initialization.service";

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private injector: Injector,
    private initializationService: InitializationService
  ) { }

  private initial(resolve: any, reject: any) {
    const tokenData = this.tokenService.get();
    const currentTime = new Date().getTime();

    if (!tokenData.token || currentTime - tokenData.loginTime > tokenData.lifeTime) {
      this.injector.get(Router).navigateByUrl('/passport/login');
      resolve({});
      return;
    }

    this.initializationService.initial();

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
