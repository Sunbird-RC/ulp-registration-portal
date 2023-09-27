import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import get from 'lodash-es/get';
import { DataService } from 'src/app/services/data/data-request.service';
@Component({
  selector: 'select-wrapper',
  template: `
  <div class="form-group">
    <label>{{to.label}} <span class="">*</span></label>
    <ng-container #fieldComponent></ng-container>
  </div>
  `,
})
export class SelectWrapper extends FieldWrapper {

  constructor(private dataService: DataService) {
    super();
  }
  ngOnInit(): void {
    if (this.to.optionsApi) {
      this.dataService.get({ url: this.to.optionsApi }).subscribe((data: any) => {
        if (this.to.responsePath) {
          this.to.options = get(data, this.to.responsePath);
          console.log(this.to.options);
        } else {
          this.to.options = data;
        }
      });
    }
  }
}
