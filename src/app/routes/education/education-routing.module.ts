import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EducationStudentComponent } from './student/student.component';

const routes: Routes = [

  { path: 'student', component: EducationStudentComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationRoutingModule { }
