/* @ Decorators */
// Decorators function start with capital letter
// target of this decorator is the constructor function
/*
function Logger(constructor: Function) {
  console.log('Logging...');
  // we actually see the whole class but class in the end are
  // just syntactic sugar over constructor functions
  // NOTE: Decorators execute when class is defined not when it is instantiated
  // Decorators run when JS finds class defination, constructor definition not
  // when we use that constructor function
  console.log(constructor);
}
*/
/* @ Decorator Factory */
// decorator factory returns a decoration function that allows us to
// configure it when we assigin it as a decorator to something
// When we apply decorator factory, we've to execute it as a function so
// that we execute the outer function and we attach the return value, which
// is this inner function which is valid decorator function as a decorator to class therefore
// this allows us to accept arguments

function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

// Meta Programming - We're creating things, we're creating decorator functions,
// which we might say have some impact on the end user
// In the end we do render something on the screen, but we do that with a tool we
// expose to other developers because this Decorator is such a tool which other
// developers have to use by adding it to a class

function WithTemplate(template: string, hookId: string) {
  // adding `_` on constructor argument of decorator signals TS that we get this
  // argument but we don't need it but we have to specify it though
  return function (constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}

// @Logger('LOGGIN - PERSON')
// We can build really advanced decorators like this which all of a sudden does some
// magic behind the scenes. That's metaprogramming! We add some logic which we
// could expose if this would be a third-party library we share with other users
// We could expose this as part of the library and anyone who uses our library can
// import this decorator function and add it to a class, to then magically
// render some content all of a sudden
@WithTemplate('<h1>My person object</h1>', 'app')
class Person {
  name = 'Colson';

  constructor() {
    console.log('Creating person object...');
  }
}

const per = new Person();
console.log(per);
