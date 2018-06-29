import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {InitializationService} from "@shared/services/initialization.service";
import {Router} from "@angular/router";

@Directive({
  selector: '[showAuthed]'
})
export class ShowAuthedDirective implements OnInit {

  condition: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private initializationService: InitializationService,
    private router: Router
  ) { }

  /**
   * 如果没有登录（认证成功）并且符合condition条件时，那么清理当前的容器页面，同时路由到登录页面。
   */
  ngOnInit(): void {
    this.initializationService
      .isAuthenticated
      .subscribe(
        isAuthenticated => {
          if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
            this.router.navigate(['/passport/login']);
          }
        }
      );
  }

  @Input() set showAuthed(condition: boolean) {
    this.condition = condition;
  }
}
