import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import {AuthGuard} from "@shared/guards/auth.guard";
import {ACLGuard} from "@delon/acl";


const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      //注意：dashboard不能设置ACLGuard，因为他是所有重定向的页面，要不然会出现白屏。
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: '仪表盘', titleI18n: 'dashboard', guard: 80100001 }, canLoad: [ ACLGuard ] },
      // 业务子模块
      // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
      { path: 'education', loadChildren: './education/education.module#EducationModule', canLoad: [ ACLGuard ], data: { guard: 80100001 }},
      { path: 'record', loadChildren: './record/record.module#RecordModule', canLoad: [ ACLGuard ], data: { guard: 90100001 }},
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule', canLoad: [ ACLGuard ], data: { guard: 90100001 }},
      { path: 'system', loadChildren: './system/system.module#SystemModule', canLoad: [ ACLGuard ], data: { guard: 50100001 }},
      { path: 'poor', loadChildren: './poor/poor.module#PoorModule', canLoad: [ ACLGuard ], data: { guard: 40100001 }},
    ]
  },
  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录', titleI18n: 'pro-login' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册', titleI18n: 'pro-register' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果', titleI18n: 'pro-register-result' } }
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: 'lock', component: UserLockComponent, data: { title: '锁屏', titleI18n: 'lock' } },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
