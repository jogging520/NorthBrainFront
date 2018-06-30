import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoorSchoolComponent } from './school/school.component';

const routes: Routes = [

  { path: 'school', component: PoorSchoolComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoorRoutingModule { }
