"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* @ Decorators */
// Decorators function start with capital letter
// target of this decorator is the constructor function
function Logger(constructor) {
    console.log('Logging...');
    // we actually see the whole class but class in the end are
    // just syntactic sugar over constructor functions
    // NOTE: Decorators execute when class is defined not when it is instantiated
    // Decorators run when JS finds class defination, constructor definition not
    // when we use that constructor function
    console.log(constructor);
}
let Person = class Person {
    constructor() {
        this.name = 'Colson';
        console.log('Creating person object...');
    }
};
Person = __decorate([
    Logger
], Person);
const per = new Person();
console.log(per);
