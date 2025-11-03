import { parse } from './commands/index.js';
import { errors } from './errors/index.js';

function helloWorld() {
  console.log("Hello, World!")
}

export { 
  helloWorld, 
  parse,
  errors
};
