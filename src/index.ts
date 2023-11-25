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

@Logger('LOGGIN - PERSON')
class Person {
  name = 'Colson';

  constructor() {
    console.log('Creating person object...');
  }
}

const per = new Person();
console.log(per);
