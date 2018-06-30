import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import {NzMessageService} from "ng-zorro-antd";
import {SchoolService} from "@shared/services/school.service";
import {School} from "@shared/models/school";

@Component({
  selector: 'app-poor-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.less'],
})
export class PoorSchoolComponent implements OnInit {

  q: any = {
    status: 'all',
  };
  loading = false;
  schools: School[] = [];

  categories = [
    { id: 0, text: '幼儿园', value: false },
    { id: 1, text: '小学', value: false },
    { id: 2, text: '初中', value: false },
    { id: 3, text: '高中', value: false },
    { id: 4, text: '大学', value: false },
  ];

  constructor(
    private schoolService: SchoolService,
    public messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getSchools();
  }

  getSchools() {
    this.loading = true;
    this.schoolService
      .querySchoolsByRegionIds(["931"])
      .subscribe((schools: School[]) => {
      this.schools = schools;},
        () => {this.loading = false;},
      () => {this.loading = false;}
    );
  }

}
