import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RecordRoutingModule } from './record-routing.module';
import { RecordOperationComponent } from './operation/operation.component';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [
  RecordOperationComponent];

@NgModule({
  imports: [
    SharedModule,
    RecordRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RecordModule { }
