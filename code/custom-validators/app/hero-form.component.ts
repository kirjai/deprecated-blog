import { Component, ViewEncapsulation, OnInit } from 'angular2/core';
import { FormBuilder, ControlGroup, ControlArray, Control, AbstractControl, Validators, Validator, FORM_BINDINGS, FORM_DIRECTIVES, FORM_PROVIDERS} from 'angular2/common';

@Component({
  selector: 'hero-form',
  templateUrl: 'app/hero-form.component.html',
  // viewBindings: [FORM_BINDINGS],
  // directives: [FORM_DIRECTIVES],
  // providers: [FORM_PROVIDERS]
})

export class HeroForm implements OnInit {
  emailForm: ControlGroup;
  submitted: Boolean = false;
  email: AbstractControl;

  constructor(public builder: FormBuilder) {
  };

  ngOnInit() {
    this.emailForm = this.builder.group({
      email: ['', Validators.compose([this.checkLength, Validators.required])],
    })

    this.email = this.emailForm.controls['email'];
  }

  checkLength(fieldControl: Control) {
    return fieldControl.value.length >= 5 ? null : { length: true }
  }

  onSubmit() {
    this.submitted = true;
  }

  get diagnostic(): string {
    return JSON.stringify(this.emailForm.value);
  }
};
