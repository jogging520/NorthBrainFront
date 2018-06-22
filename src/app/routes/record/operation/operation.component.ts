import { Component, OnInit } from '@angular/core';
import {RegionService} from "@shared/services/region.service";
import {User} from "@shared/models/user";
import {InitializationService} from "@shared/services/initialization.service";

  @Component({
    selector: 'app-record-operation',
    templateUrl: './operation.component.html',
  })
  export class RecordOperationComponent implements OnInit {

    options:any  = [{label: '请选择'}];

    values: any[];

    user: User;

    constructor(
      private regionService: RegionService,
      private initializationService: InitializationService
    ) { }

    ngOnInit(): void {
      this.regionService
        .queryAllRegions()
        .subscribe(option => this.options.push(option));

      this.initializationService
        .currentUser
        .subscribe(user => this.user = user);

      console.log(this.options);
    }

    onChanges(values: any): void {
      console.log(this.options);
      console.log(values, this.values);
    }

  }
