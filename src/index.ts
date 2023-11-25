/* @ Decorators */
// Decorators function start with capital letter
// target of this decorator is the constructor function
function Logger(constructor: Function) {
  console.log('Logging...');
  // we actually see the whole class but class in the end are
  // just syntactic sugar over constructor functions
  // NOTE: Decorators execute when class is defined not when it is instantiated
  // Decorators run when JS finds class defination, constructor definition not
  // when we use that constructor function
  console.log(constructor);
}

@Logger
class Person {
  name = 'Colson';

  constructor() {
    console.log('Creating person object...');
  }
}

const per = new Person();
console.log(per);
