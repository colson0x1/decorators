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

// now this decorator will run when the class is instantiated
// hence all of a sudden, we're able to add logic that doesn't run
// when the class is defined but when the class is instantiated
function WithTemplate(template: string, hookId: string) {
  // adding `_` on constructor argument of decorator signals TS that we get this
  // argument but we don't need it but we have to specify it though
  console.log('TEMPLATE FACTORY');
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T,
  ) {
    // returning new class. class here is just syntactic sugar for
    // constructor function. hence, returning constructor function in the end
    // which is based on the original constructor function
    return class extends originalConstructor {
      // adding new constructor func
      // doing this now the template should only be rendered to the DOM if
      // we really instantiate our object here and not all the time when this
      // decorator function is executed which happens as soon as we define class
      constructor(..._: any[]) {
        // calling original constructor function
        // doing that saves original constucture. not required though
        super();

        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        // const p = new originalConstructor();
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
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

// Besides properties, We can also add decorators to accessors
// target is prototype if we're dealing with instance accessor
// or target will be constructor function if we're dealing with static one
// if we don't know, target will be of type any
// arguments: target, name of the accessor and descriptor which
// will be of type PropertyDescriptor (that's type builtin TS)
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Besides properties and accessors, We can also add decorators to methods
// Method decorators also receives three arguments
// target: if instance method then prototype of the object else
// it its a static method, then constructor function
// target, name of the method, descriptor
// here descriptor is little bit different since its method descriptor not an accessor descriptor
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor,
) {
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// The last decorator we can add is to a parameter
// the arguments it gets is, target, not the name of the parameter
// but the name of the method in which we used this parameter,
// and last argument is: position of the argument so the index of this argument
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
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

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

// Decorators executes when we define the class
// Those are not decorators that run at run time when we call a
// method or when we work with a property. That's now what they do instead
// these decorators allows us to do additional behind the scenes set up work
// when a class is defined. That's the idea of decorators, that's their core
// use case
// Decorator itself is just a function that executes when our class is defined,
// when properties or method is therefore registered and so on!
const p1 = new Product('Hoodie', 450);
const p2 = new Product('Book', 39);

/* @ Advanced usecase of Decorators */
// Some decorators for example: class decorators and method decorators actually
// are also capable of returning something
