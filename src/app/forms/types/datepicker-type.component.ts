import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import * as dayjs from 'dayjs';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-datepicker',
  template: `
  <div class="form-group">
    <label *ngIf="to.label"> {{ to.label | translate}} <span class="">*</span></label>
    <input type="text" class="form-control calendar" placement="bottom" [readonly]="true" bsDatepicker [formlyAttributes]="field"
      #datePicker [bsConfig]="bsConfig" [placeholder]="to.placeholder" (bsValueChange)="onValueChange($event)"
       [formControl]="formControl"/>
    <div *ngIf="showError" class="text-danger">
      <ng-container *ngIf="formControl.touched && formControl.hasError('required')">
        {{'FIELD_IS_REQUIRED' | translate}}
      </ng-container>
      <ng-container *ngIf="formControl.dirty && formControl.invalid">
        {{'ENTER_VALID_DATE' | translate}}
      </ng-container>
     </div>
  </div>
  `,
  styles: [
    '.form-control[readonly] { background-color: #fff; }'
  ]
})
export class DatepickerTypeComponent extends FieldType implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  get theme(): string { return this.to.theme || 'theme-dark-blue'; }
  get dateInputFormat(): string { return this.to.dateInputFormat || 'DD/MM/YYYY'; }

  @ViewChild(BsDatepickerDirective, { static: false }) datepicker?: BsDatepickerDirective;

  @HostListener('document:mousewheel')
  onScrollEvent() {
    console.log("on scroll");
    this.datepicker?.hide();
  }
  ngOnInit(): void {
    this.bsConfig = {
      dateInputFormat: this.dateInputFormat,
      showWeekNumbers: true,
      containerClass: this.theme,
      isAnimated: true,
      adaptivePosition: true,
      maxDate: new Date()
    };
  }

  onValueChange(event) {
    if (dayjs(event).isValid()) {
      const formattedDate = dayjs(event).format('DD/MM/YYYY');
      this.formControl.setValue(formattedDate, { emitEvent: false });
      this.field.formControl.setValue(formattedDate, { emitEvent: true });

      if (this.formControl.value !== this.model[this.field.key as any]) {
        this.model[this.field.key as any] = this.formControl.value;
        this.formControl.updateValueAndValidity();
      }
    }
  }
}
