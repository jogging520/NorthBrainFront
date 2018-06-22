import { Component, OnInit } from '@angular/core';
  import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import {StudentService} from "@shared/services/student.service";

  @Component({
    selector: 'app-education-view',
    templateUrl: './view.component.html',
  })
  export class EducationViewComponent implements OnInit {
    record: any = {};
    i: any;
    sexes: string[] = ['男', '女'];
    levels: string[] = ['一般贫困', '普通贫困', '特别贫困', '赤贫'];
    grades: string[] = ['小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级', '初中一年级', '初中二年级', '初中三年级', '高中一年级', '高中二年级', '高中三年级'];
    loading: boolean;

    constructor(
      private modal: NzModalRef,
      public msgSrv: NzMessageService,
      public studentService: StudentService
    ) { }

    ngOnInit(): void {
      //this.http.get(`/user/${this.record.id}`).subscribe(res => this.i = res);
    }

    close() {
      this.modal.destroy();
    }

    save() {
      this.loading = true;
      this.studentService.
        save(this.i).
        subscribe(student => {
          console.log(student);
          this.loading = false;
        },
        error2 => this.loading = false);
    }
  }
