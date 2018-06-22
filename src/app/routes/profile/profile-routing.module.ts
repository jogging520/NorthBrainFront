import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileUserComponent } from './user/user.component';
import {AuthGuard} from "@shared/guards/auth.guard";

const routes: Routes = [

  { path: 'user', component: ProfileUserComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
