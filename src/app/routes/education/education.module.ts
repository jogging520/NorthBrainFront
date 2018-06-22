import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EducationRoutingModule } from './education-routing.module';
import { EducationStudentComponent } from './student/student.component';
import { EducationViewComponent } from './student/view/view.component';

const COMPONENTS = [
  EducationStudentComponent];
const COMPONENTS_NOROUNT = [
  EducationViewComponent];

@NgModule({
  imports: [
    SharedModule,
    EducationRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class EducationModule { }
