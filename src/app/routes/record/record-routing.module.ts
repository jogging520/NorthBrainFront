import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecordOperationComponent} from "./operation/operation.component";

const routes: Routes = [
  { path: 'operation', component: RecordOperationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordRoutingModule { }
