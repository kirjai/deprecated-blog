---
layout: post
title:  "Angular component testing with routerLink and routerOutlet"
permalink: /ng2-component-testing-routerlink-routeroutlet/
date:   2016-11-07 12:00:00 +0000
---

<!--Those of us writing tests to go along with our awesome Angular 2 applications,
were, most likely, extremely happy when the [official Angular testing documentation](https://angular.io/docs/ts/latest/guide/testing.html)
has finally landed after much anticipation. The docs are excellent, extremely thorough and are a great read
for everyone who is writing angular tests, I highly recommend setting some time aside and reading
through them at some point. However, there is **a lot** of information on that page and it might
be a little intimidating and I personally find that it might get a little hard trying to find
exactly what you are looking for, especially when you are debugging the tests for your application.-->

<!--Testing is a fairly complicated subject and there are a lot of ways you can test your app depending on
how it is written, and so the official testing guide is trying to cover a lot of ground and explain a lot of
different testing scenarios, which some times may lead to overcomplication.-->

[Official angular testing documentation](https://angular.io/docs/ts/latest/guide/testing.html) is a great place to start when it comes to testing your application,
and while the docs are great and thorough, it might get a little hard trying to quickly find the info that you are
looking for. Especially when things go wrong and you are in the middle of debugging your tests.

One specific subject that I found the docs to be slightly too clever on was testing components that use
the `routerOutlet` and the `routerLink`.

The problem manifests itself as the following error messages:

`'router-outlet' is not a known element`

and 

`Can't bind to 'routerLink' since it isn't a known property`

The official documentation explains how you can [stub these two directives in your tests](https://angular.io/docs/ts/latest/guide/testing.html#!#router-outlet-component),
which might be beneficial if you want to test the click events on an element with a
`routerLink`. But more often these error messages prevent the component from rendering and running our
other tests for said component. In which case, all you need to do is add the `RouterTestingModule` to your
imports in the testing module configuration, like so:

{% highlight javascript %}
  <!-- app.component.spec.ts -->
  import { RouterTestingModule } from '@angular/router/testing';

  TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent],
  });

{% endhighlight %} 

This solution still allows you to stub either of these directives in the future, if and when you need it.

> You can find example application with the code above <a href="https://github.com/kirjai/blog-code-snippets/blob/master/testing-routerlink/src/app/app.component.spec.ts" target="_blank">here</a> 

