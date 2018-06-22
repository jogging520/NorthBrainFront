import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {InitializationService} from "@shared/services/initialization.service";

@Directive({
  selector: '[showAuthed]'
})
export class ShowAuthedDirective implements OnInit {

  condition: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private initializationService: InitializationService
  ) { }

  ngOnInit(): void {
    this.initializationService
      .isAuthenticated
      .subscribe(
        isAuthenticated => {
          if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
          }
        }
      );
  }

  @Input() set showAuthed(condition: boolean) {
    this.condition = condition;
  }
}
