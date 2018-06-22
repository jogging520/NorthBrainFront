import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {getTimeDistance} from "@delon/util";
import {NzMessageService} from "ng-zorro-antd";
import {User} from "@shared/models/user";
import {InitializationService} from "@shared/services/initialization.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {

  rankingListData: any[] = Array(7)
    .fill({})
    .map((item, i) => {
      return {
        title: `工专路 ${i} 号店`,
        total: 323234,
      };
    });

  data: any = {
    salesData: [],
    offlineData: [],
  };
  loading = true;
  date_range: Date[] = [];
  user: User;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private initializationService: InitializationService
  ) { }

  ngOnInit() {
    this.initializationService
      .currentUser
      .subscribe(user => this.user = user);
  }

  setDate(type: any) {
    this.date_range = getTimeDistance(type);
  }

}
