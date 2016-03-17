System.register(['angular2/core', 'angular2/common'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1;
    var HeroForm;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            HeroForm = (function () {
                function HeroForm(builder) {
                    this.builder = builder;
                    this.submitted = false;
                    this.passwordValidator = this.passwordValidator.bind(this);
                    this.scheduleForm = this.builder.group({
                        email: ['', common_1.Validators.required],
                        register: [false],
                        password: ['', this.passwordValidator]
                    });
                    this.register = this.scheduleForm.controls['register'];
                }
                ;
                HeroForm.prototype.ngOnInit = function () {
                };
                HeroForm.prototype.passwordValidator = function (field) {
                    var isEmpty = field.value.length > 0 ? false : true;
                    console.log(this);
                    console.log(this.register);
                    console.log(this);
                    // if(register.value){
                    //   return !isEmpty ? null : {
                    //     invalidPassword: true
                    //   }
                    // }
                };
                HeroForm.prototype.checkLength = function (field) {
                    if (field.value.length <= 5) {
                        return null;
                    }
                    else {
                        return { length: false };
                    }
                };
                HeroForm.prototype.onSubmit = function () {
                    this.submitted = true;
                };
                Object.defineProperty(HeroForm.prototype, "diagnostic", {
                    get: function () {
                        return JSON.stringify(this.scheduleForm.value);
                    },
                    enumerable: true,
                    configurable: true
                });
                HeroForm = __decorate([
                    core_1.Component({
                        selector: 'hero-form',
                        templateUrl: 'app/hero-form.component.html',
                        // viewBindings: [FORM_BINDINGS],
                        directives: [common_1.FORM_DIRECTIVES],
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder])
                ], HeroForm);
                return HeroForm;
            }());
            exports_1("HeroForm", HeroForm);
            ;
        }
    }
});
//# sourceMappingURL=hero-form.component.js.map