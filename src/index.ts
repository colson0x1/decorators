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
// This decorator will replace the class that its added to
// with a new class that implements old class
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
): PropertyDescriptor {
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
  // returning new descriptor object in the end
  return {};
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

/* @ Autobind Decorator */
// building a decorator which will automatically bind 'this' to the surrounding class,
// or to the object this method belongs to, everytime its called no matter where we call it from
// In Autobind, we want to make sure that we always set the 'this'
// keyword to the object this method belongs to
// This is a decorator function returning a descriptor object which will override the old descriptor
// and TS will then, replace the old methods descriptor, so the old methods configuration with this
// new configuration here, which added the extra getter layer here
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    // not using 'value' here. getter is extra logic that runs before the value is returned
    get() {
      // here 'this' will refer to whatever is responsible for triggering this getter method
      // the getter method will be triggered by the concrete object to which it belongs
      // so 'this' inside of the getter method will always refer to the object on which we defined the getter
      // this will not be overwritten by addEventListener because the getter is like an extra layer
      // between our function that's being executed and the object to which it belongs
      // therefore 'this' in here will refer to the object on which we originally defined the method
      // So we can safely bind this for the original method and ensure that now 'this' inside of the
      // original method will also refer to the same object
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = 'Yo! THIS WORKS!!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
p.showMessage();

const button = document.querySelector('button')!;
// here in event listener, 'this' refers to the target of the event
// because addEventListener in the end, binds 'this' in the function which is to be executed
// to the target of the event
// button.addEventListener('click', p.showMessage.bind(p));

// Using decorator to bind
button.addEventListener('click', p.showMessage);

/* @ Decorator for Validation */
// One common scenario we might encounter in some applications is that we fetched data,
// lets say from a web resource and we get data where we guess  we've a couple of courses let's say but
// we dont know for sure.
// Or another possible scenario, We let users enter the data and we simply want to assign that data and
// trade a new course with the user-entered data and we assumed it's right, but we're not guaranteed
// that it's right and therefore we want to validate the input

interface ValidatorConfig {
  // using indexed type notation
  [property: string]: {
    [validatableProp: string]: string[]; // ['required', 'positive']
  };
}

// registeredValidators initially is an empty object because initially when the apps starts,
// when our third-party library gets loaded, no validators have been registered yet
const registeredValidators: ValidatorConfig = {};

// property decorator
function Required(target: any, propName: string) {
  // the prototype of the instance that we're working with will have a constructor key which
  // points at the constructor function that was used to create our object and that therefore
  // will basically be something like Course here, so the name of the contructor function in the end
  // can be retrieved from the constructor because constructor is a function, we can use the name
  // property which exists on any function in JavaScript to get the function name and this then will be
  // the Course name here for example
  // Now wre registered class name as a key in registeredValidators and the value for that is an object
  registeredValidators[target.constructor.name] = {
    // add existing validator before we add our new one
    ...registeredValidators[target.constructor.name],
    // dynamically assigned property, property which we want to add a validator as a key
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      'required',
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      'positive',
    ],
  };
}

// So with that along with these what we added thus far (i.e @Required, @PositiveNumber), we registered
// these properties and their validators in our global config when this class is defined

// Validate function should go through all registered validators and basically run different logic
// based on which validators it finds
function validate(obj: any) {
  // So here first of all, we want to retrieve the configuration for the concrete object we're dealing with
  // For that we need to find out which constructor function the object is based on then get the
  // validation config or the property validator mappings here which we set up for that object
  // [obj.constructor.name] = we access the constructor property which exists on the prototype of the object
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig) {
    // console.log(prop);
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          // !! - the double bang operator convert to real true or false value
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert('Invalid input, please try again');
    return;
  }
  console.log(createdCourse);
});
