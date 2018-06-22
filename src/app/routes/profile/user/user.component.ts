import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import {RegionService} from "@shared/services/region.service";
import {UserService} from "@shared/services/user.service";
import {User} from "@shared/models/user";
import {OrganizationService} from "@shared/services/organization.service";
import {of} from "rxjs/index";
import {InitializationService} from "@shared/services/initialization.service";

@Component({
  selector: 'app-profile-user',
  templateUrl: './user.component.html',
})
export class ProfileUserComponent implements OnInit {

  form: FormGroup;
  submitting = false;
  regionOptions:any  = [{label: '请选择'}];
  orgOptions:any  = [{label: '请选择'}];

  regionValues: any[];
  orgValues: any[];
  user: User;
  orgs: string[] = [];

  errorInfo: string;

  constructor(private fb: FormBuilder,
              private msg: NzMessageService,
              private regionService: RegionService,
              private organizationService: OrganizationService,
              private userService: UserService,
              private initializationService: InitializationService
) {}

  ngOnInit(): void {

    this.initializationService
      .currentUser
      .subscribe(user => {
        this.user = user;

        console.log(this.user);
        //this.orgs.splice(0, this.orgs.length);
        //this.orgOptions.splice(0, this.orgOptions.length);
        this.user.affiliations.forEach(aff => this.orgs.push(aff.organizationId));

        for(var org of this.orgs) {
          console.log(org);
          this.organizationService
            .queryOrganizations(org)
            .subscribe(option => this.orgOptions.push(option));
        }
      });

    this.regionService
      .queryAllRegions()
      .subscribe(option => this.regionOptions.push(option));



    //this.orgOptions.shift();

    this.form = this.fb.group({
      region: [null, [Validators.required]],
      organization: [null, [Validators.required]],
      title: [null, [Validators.required]],
      date: [null, [Validators.required]],
      goal: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      client: [null, []],
      invites: [null, []],
      weight: [null, []],
      public: [1, [Validators.min(1), Validators.max(3)]],
      publicUsers: [null, []],
    });

  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.msg.success(`提交成功`);
    }, 1000);
  }

  onChanges(values: any): void {
    console.log(this.orgValues);
    this.msg.info("=========");
  }

  queryOrgs(): void {

    this.orgs.splice(0, this.orgs.length);
    this.orgOptions.splice(0, this.orgOptions.length);
    this.user.affiliations.forEach(aff => this.orgs.push(aff.organizationId));

    for(var org of this.orgs) {
      this.organizationService
        .queryOrganizations(org)
        .subscribe(option => this.orgOptions.push(option));
    }


    //this.orgOptions.splice(1,1);

  }

  queryTest(): void {
    this.userService.queryTest()
      .subscribe(test => {
          console.log(test.error.name);
          this.errorInfo = test.error.name;
        },
        error2 => {
          console.log(JSON.parse(error2.error.message).key);
          });
  }
}
