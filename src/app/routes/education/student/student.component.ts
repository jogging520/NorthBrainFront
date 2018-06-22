import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import {NzMessageService} from "ng-zorro-antd";
import {StudentService} from "@shared/services/student.service";
import {environment} from "@env/environment";
import {EducationViewComponent} from "./view/view.component";
import {filter} from "rxjs/internal/operators";

@Component({
  selector: 'app-education-student',
  templateUrl: './student.component.html',
})
export class EducationStudentComponent implements OnInit {

  params: any = {};
  students: any[];
  @ViewChild('st') st: SimpleTableComponent;

  columns: SimpleTableColumn[] = [
    { title: '贫困生编号', index: 'studentId', width: '120px'},
    { title: '姓名', index: 'name', width: '120px' },
    { title: '年龄', index: 'age', width: '120px' },
    { title: '性别', index: 'sex', width: '100px' },
    { title: '学校编号', index: 'schoolId', width: '100px' },
    { title: '学校名称', index: 'schoolName', width: '100px' },
    { title: '省份', index: 'province', width: '100px' },
    { title: '市', index: 'city', width: '100px' },
    { title: '县区', index: 'county', width: '100px'},
    { title: '住址', index: 'address', width: '100px' },
    { title: '电话号码', index: 'phone', width: '100px' },
    { title: '贫困等级', index: 'level', width: '100px' },
    { title: '年级', index: 'grade', width: '100px' },
    { title: '状态', index: 'status', width: '100px' },
    { title: '创建时间', index: 'createDate' , type: 'date', width: '100px'},
    { title: '状态时间', index: 'statusDate' , type: 'date', width: '100px'},
    {
      title: '操作',
      width: '180px',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          component: EducationViewComponent,
          paramName: 'i',
          click: () => this.msg.info('回调，重新发起列表刷新'),
        },
        { text: '图片', click: () => this.msg.info('click photo') },
        { text: '经营SKU', click: () => this.msg.info('click sku') },
      ],
    }
  ]

  constructor(
    public msg: NzMessageService,
    private modal: ModalHelper,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    this.studentService
      .listing()
      .subscribe(student => this.students = student);
  }

    add() {
       this.modal
         .static(EducationViewComponent, { i: { id: 0 } })
         .pipe(filter(w => w === true))
         .subscribe(() => this.st.reload());
    }

}
