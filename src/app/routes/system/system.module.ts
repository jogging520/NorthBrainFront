import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';
import { SystemUserComponent } from './user/user.component';
import { SystemLogComponent } from './log/log.component';
import { SystemPrivilegeComponent } from './privilege/privilege.component';

const COMPONENTS = [
  SystemUserComponent,
  SystemLogComponent,
  SystemPrivilegeComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    SystemRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SystemModule { }
