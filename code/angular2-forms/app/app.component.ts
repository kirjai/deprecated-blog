import { Component } from 'angular2/core';
import { HeroForm } from './hero-form.component';

@Component({
    selector: 'my-app',
    template: '<hero-form></hero-form>',
    directives: [HeroForm]
})
export class AppComponent { }
