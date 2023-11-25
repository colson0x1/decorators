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
  console.log('LOGGER FACTORY');
  return function (constructor: Function) {
    console.log('Rendering logger');
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
  console.log('TEMPLATE FACTORY');
  return function (constructor: any) {
    console.log('Rendering template');
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

// Note decorators functions execute in bottom-up fashion. bottom-most decorator first and
// thereafter the decorators above it
// Here @WithTemplate runs first and then @Logger executes
// But decorator factories runs earlier. In the example above, 'LOGGER TEMPLATE' runs first
// and then 'TEMPLATE FACTORY' and after that decorators functions from bottom-top
// So the creation of actual decorator function happens in the order in which we specify
// these factory functions But the execution of these actual decorator functions
// then happens bottom-up
@Logger('LOGGING')
@WithTemplate('<h1>My person object</h1>', 'app')
class Person {
  name = 'Colson';

  constructor() {
    console.log('Creating person object...');
  }
}

const per = new Person();
console.log(per);

/* Places where we can add Decorators besides class */
// We need a class for any decorators we can use but
// we don't have to add all decorators directly to the class

// Decorator function
// Which argument decorator function gets depends on where we use it!
// If we log decorator to a property, it receives two argument
// For instance property like title: string; which we call on a instance if we work with it
// This will be the prototype of the object that was created but If we have a static property
// target will refer to the constructor function state

// Here we're adding any because we don't know exactly which structure this object will have
// Second argument we get is the propertyName simply
// That could be a string here, could of course be a symbol we don't know what we use as a property identifier
// When logger executes is, since we never instantiate our Product, it executes basically when
// our class definition is registered by JavaScript
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
  private _price: number;

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
