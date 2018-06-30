import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PoorRoutingModule } from './poor-routing.module';
import { PoorSchoolComponent } from './school/school.component';

const COMPONENTS = [
  PoorSchoolComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PoorRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class PoorModule { }
