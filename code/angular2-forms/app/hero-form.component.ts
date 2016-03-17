import { Component, ViewEncapsulation, OnInit } from 'angular2/core';
import { FormBuilder, ControlGroup, ControlArray, Control, AbstractControl, Validators, Validator, FORM_BINDINGS, FORM_DIRECTIVES, FORM_PROVIDERS} from 'angular2/common';

@Component({
  selector: 'hero-form',
  templateUrl: 'app/hero-form.component.html',
  // viewBindings: [FORM_BINDINGS],
  directives: [FORM_DIRECTIVES],
  // providers: [FORM_PROVIDERS]
})

export class HeroForm implements OnInit {
  scheduleForm: ControlGroup;
  submitted: Boolean = false;
  register: AbstractControl;

  constructor(public builder: FormBuilder) {
  };

  ngOnInit() {
    this.passwordValidator = this.passwordValidator.bind(this);

    this.scheduleForm = this.builder.group({
      email: ['', Validators.required],
      register: [false],
      password: ['', this.passwordValidator]
    })

    this.register = this.scheduleForm.controls['register'];

  }

  passwordValidator(field: Control){
    var isEmpty = field.value.length > 0 ? false : true;
    console.log(typeof this);
    for (var key in this){
      console.log(key);
    }
    console.log(this.passwordValidator);
    console.log(this);
    // if(this.register.value){
    //   return !isEmpty ? null : {
    //     invalidPassword: true
    //   }
    // }
  }

  onSubmit() {
    this.submitted = true;
  }


  get diagnostic(): string {
    return JSON.stringify(this.scheduleForm.value);
  }
};
