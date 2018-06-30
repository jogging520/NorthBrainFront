import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemUserComponent } from './user/user.component';
import { SystemLogComponent } from './log/log.component';
import { SystemPrivilegeComponent } from './privilege/privilege.component';

const routes: Routes = [

  { path: 'user', component: SystemUserComponent },
  { path: 'log', component: SystemLogComponent },
  { path: 'privilege', component: SystemPrivilegeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
