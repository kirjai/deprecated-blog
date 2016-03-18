---
layout: post
title:  "Validation for Model-driven forms in Angular 2"
date:   2016-03-17 22:17:00 +0000
---
As you might know, there are two prominent ways of creating forms in Angular 2: **Template-driven** forms and **Model-driven forms**. **Template-driven** forms definitely have a stronger correlation to how forms are created in AngularJS 1.x, in that they mostly rely on you declaring your form logic in the HTML template. **Model-driven** forms however, are created from a configuration that you specify in your Component declaration.

In this post we will be going over the Model-driven form definition, how to make use of validators as well as writing your own custom validators and providing users with good error messages upon validation.


### Set up

Firstly, let's create a simple component and its corresponding template.

{% highlight javascript %}

  // email-form.component.ts
  import { Component } from 'angular2/core';

  @Component({
    selector: 'email-form',
    templateUrl: 'email-form.component.html'
  })

  export class EmailForm { }

{% endhighlight %}

{% highlight html %}

  <!-- email-form.component.html -->
  <form>
    <h2>Email Form</h2>
    <label for="email">Email:</label>
    <input id="email" type="text">

    <button type="submit">Submit</button>
  </form>

{% endhighlight %}

This creates a very basic form that doesn't do anything yet. So the next step is to write up our component and the template.

### Enter the `FormBuilder`

The `FormBuilder` is part of the `angular2/common` module that we will be using to create our Model-driven form.

In order to use the `FormBuilder`, we need to import it into our component definition file first.

{% highlight javascript %}
  // email-form.component.ts
  import { FormBuilder } from 'angular2/common';
{% endhighlight %}

Next we need to actually inject the `FormBuilder` into our component. We do that as we would with any service - in our constructor.

{% highlight javascript %}
  // email-form.component.ts
  export class EmailForm {
    constructor (private builder: FormBuilder) { }
  }

{% endhighlight %}

Now we can use the `FormBuilder` by referencing it by its the private variable name `builder`, inside our component. Great! So we can now create our form configuration. Let me first provide an example, which I will explain in more detail afterwards.

{% highlight javascript %}

  // email-form.component.ts
  ...

  constructor (private builder: FormBuilder) {
    this.emailForm = this.builder.group({})
  }

{% endhighlight %}

We've created a new property on our class `emailForm` and assigned a new `group` created by the builder. **However**, we assigned the group to a property we haven't defined yet, so, at the top of our `EmailForm` class we need to define the new `emailForm` property. One thing to note is that the name of the property `emailForm` can be anything, as with any variable, it is not yet mapped to anything at this point.

{% highlight javascript %}

  // email-form.component.ts
  export class EmailForm {
    emailForm: ControlGroup;

    ...
  }

{% endhighlight %}

The type of the `emailForm` property is `ControlGroup`, which quite literally is a group of `Control`s.

### `Control` and `ngControl`

`Control` is an Angular class, and we can map instances of this class to form fields. Without `Control`s, we can't have validations, or essentially provide *any* communication between the HTML form and the component class (unless we use `ngModel`, of course).

So since with model-driven forms we specify the form configuration upfront, we need to specify controls that the form will be mapped to. We need to do that inside the form configuration object which we are passing to the `this.builder.group()` function call inside our constructor.

{% highlight javascript %}

  // email-form.component.ts
  ...

  constructor (private builder: FormBuilder) {
    this.emailForm = this.builder.group({
        email: ['']
    })
  }

{% endhighlight %}

As I mentioned at the start of this post, we are creating a form with just one field, which is why we have only passed one instance of `Control` - titled `email` -  as part of our form configuration object.

Along with the name for our `Control`, we pass an array, where the first value is a string, which is the default value of this new form field control. Since we don't want a default value, we are just passing in an empty string.

That's great and all, but how can we map this to our HTML form in the template? There's only two things we need to do for that.

{% highlight html %}

  <!-- email-form.component.html -->
  <form [ngFormModel]="emailForm">
    <h2>Email Form</h2>
    <label for="email">Email:</label>
    <input id="email" type="text"
      ngControl="email">

    <button type="submit">Submit</button>
  </form>

{% endhighlight %}

We have added a new directive `ngFormModel` to our `form` element, and an `ngControl` to the email input field. The value we give to the `ngFormModel` corresponds to the name of our form control group, created by calling `builder.group`. And the value we give to `ngControl` is a `Control` instance that we have passed as part of our form configuration object.

Now the form we specified in the component class is mapped to the HTML form. But how can we make sure that it actually is? We can display the value of the whole form control group in our template using the usual Angular syntax below our form.

{% highlight html %}

  <!-- email-form.component.html -->
  ...
  <pre> {% raw %}{{ emailForm.value | json }} {% endraw %}</pre>

{% endhighlight %}

Try typing into the text field inside your form and see the value of `email` change inside the `emailForm` object.

### Validation

Now it's time to get creative with our form and make it more useful. Our goal is to make sure that the user has typed something into the input field before submitting the form, i.e. making the field required.

We can use the usual standard HTML validators, like `required`, `minlength` etc. inside our HTML, but let's add validators to the form inside our form configuration object.

We will want to use `Validators`, a class we need to import from `angular2/common` module.

{% highlight javascript %}
  // email-form.component.ts

  import { FormBuilder, Validators } from 'angular2/common';

  ...
{% endhighlight %}

In order to make the email input field required, we need to add the 'required' validator to where we are defining a new `Control` - `email`.

{% highlight javascript %}

  // email-form.component.ts

  constructor(private builder: FormBuilder){
    this.emailForm = this.builder.group({
        email: ['', Validators.required]
    })
  }

{% endhighlight %}

As you can see, all we need to do to add a validator for a form control is pass it inside the array. **But**, we can only pass one `Validator` and one `asyncValidator` inside that array. How do we add more validators to the same control then? By using `Validators.compose()`.

> Other built-in Angular validators you can use are:

> - `Validators.minLength(number)`

> - `Validators.maxLength(number)`

> - `Validators.pattern(string)`

There is nothing we need to modify inside our template in order to make validation work. So in order to preview that our validation is actually working, we may want to change the binding inside the `<pre>` tags in our template, to the following.

{% highlight html %}

  <!-- email-form.component.html -->
  <pre>{% raw %} {{ emailForm.controls['email'].valid }} {% endraw %}</pre>

{% endhighlight %}

This also shows you one way we can access specific `Control` objects that are part of your form, within the template. However, we will explore a better and less verbose way a little bit later.

### Custom Validators

On top of using Angular's built in validators, you are able to write your own custom validators as well. So for our example, let's write a simple useless validator that checks that the first letter typed into the input field is the letter `a`.
> In reality, you would probably want to validate email input field with a regular expression or min-length, etc. But you would simply use the existing Angular validators for that, however we want to explore how to write our own validators.

A custom validator is essentially just a function that returns `null` is you want the input value to pass validation, or anything else if you want the validation to fail. Let's declare that function, outside of our constructor.

{% highlight javascript %}

  // email-form.component.ts
  ...

  checkIfA(fieldControl: Control){
    return fieldControl.value[0] === 'a' ? null : { notA: true };
  }

{% endhighlight %}

As you can see, a validator function receives an instance of a form control that it gets applied to. We use that to access the current value of that control field and checking if it's first letter is `a`. If it is - we are returning `null`, however if it isn't we are returning an error object. Reason for returning an error object for an invalid field is so that we can provide the user with descriptive feedback as to why validation failed. We will explore just how to do that in the next section.

Now that we have our custom validation function, let's apply that to our email control.

{% highlight javascript %}

  // email-form.component.ts
  ...

  constructor(private builder: FormBuilder){
    this.emailForm = this.builder.group({
        email: ['', Validators.compose([Validators.required, this.checkIfA])]
    })
  }

  ...

{% endhighlight %}

Instead of passing just `Validators.required` inside our array for the email control, we are now passing `Validators.compose()` function, which takes in an array of any validators we one to use. In this case, we want to use both the `Validators.required` built-in validator, as well as our custom `this.checkIfA` validator.

Whatever we type into the input field now needs to pass both of these validations in order for the field to be valid, exactly what we want.

### Displaying validation errors

As you might have guessed, we can use `.valid` inside our template to check if a field control is valid or not and conditionally trigger HTML tags depending on the value. So let's explore that in more detail.

In AngularJS 1.x we had a helpful feature - `ngMessages` that we could use to more easily display helpful messages to the user and explain why their form is invalid. Let's see how we can easily recreate `ngMessages` in Angular 2.

In the previous section I showed a little snippet that we can use in our HTML template to see output the validity of our email input field. Admittedly, that was quite a verbose way of doing it and if we want to keep our templates clean and easy to read then we better use this following approach.

What we will do is, inside our component class, we will define a property for our email control, that we can easily access inside our template.

{% highlight javascript %}

// email-form.component.ts

  ...

  constructor(private builder: FormBuilder){
    this.emailForm = this.builder.group({
        email: ['', Validators.compose([Validators.required, this.checkIfA])]
    })

    this.email = this.emailForm.controls['email'];
  }

  ...

{% endhighlight %}

The idea here is that we write the same verbose way of accessing that control once, so that we can reference it easily in other places.

**However**, once again, we are assigning a value to a property on our `EmailForm` class, that doesn't exist yet. Let's add this property at the top of our class definition.

{% highlight javascript %}
  // email-form.component.ts

  export class EmailForm {
    emailForm: ControlGroup;
    email: AbstractControl;
    ...
  }

{% endhighlight %}

All we did was create a new property 'email' of type 'AbstractControl', which is an Angular class.

Now we can access the control object for the email field inside our template more easily. Let's replace our previous verbose output with the new one.

{% highlight html %}

  <!-- email-form.component.html -->

  <!-- before -->
  <pre>{% raw %} {{ emailForm.controls['email'].valid }} {% endraw %}</pre>

  <!-- after -->
  <pre>{% raw %} {{ email.valid }} {% endraw %}</pre>

{% endhighlight %}

It is a little easier to check the validity of our email field now. Let's get on to displaying error messages.

The first step we can do is show a paragraph tag `<p>` with an error message saying that the email field is invalid.

{% highlight html %}

  <!-- email-form.component.html -->
  ...
    <label for="email">Email:</label>
    <input id="email" type="text"
      ngControl="email">

      <p *ngIf="!email.valid">Email is invalid</p>
      {{*}}
  ...

{% endhighlight %}

We are using a structure directive `ngIf` that is part of Angular to conditionally display that error message. However, even though it is better than nothing, that message is not really descriptive, and considering our tricky validation (first letter needs to be an `a`), which will put off any user from this form, we definitely need better error messages. So here's a better solution.

{% highlight html %}

  <!-- email-form.component.html -->
  ...
    <label for="email">Email:</label>
    <input id="email" type="text"
      ngControl="email">

      <div *ngIf="!email.valid">
        <p *ngIf="email.hasError('required')">Email is required</p>
        <p *ngIf="email.hasError('notA')">First letter of the email needs to be an a</p>
      </div>
      {{*}}
  ...

{% endhighlight %}

The error messages are now being triggered conditionally, depending on which validations are failing. At first, both messages are displayed, however try typing anything that doesn't begin with an `a` and the `Email is required` error message will disappear, and the other one will stay. That's exactly what we want.

We used a `hasError` method on our email field control object to check if the email field has specific errors. The `notA` error that we are checking for in the second error message is the same error that we are passing inside our custom validator that we wrote.

{% highlight javascript %}

  // email-form.component.ts

  return fieldControl.value[0] === 'a' ? null : { notA: true }; // <-

{% endhighlight %}

One final enhancement I would like to add to this form is to not show the errors initially, but to only show them (if appropriate) after the user has interacted with the email field. This is a common practice and is considered a good user experience.

With our current set up, it is very easy to add that feature in.

{% highlight html %}

  <!-- email-form.component.html -->
  ...
  <div *ngIf="!email.valid && email.touched">
    <p *ngIf="email.hasError('required')">Email is required</p>
    <p *ngIf="email.hasError('notA')">First letter of the email needs to be an a</p>
  </div>
  ...
{{*}}
{% endhighlight %}

All we did is added an `&&` to our `ngIf` directive, which checks if the email field has been interacted with, or `touched`.
