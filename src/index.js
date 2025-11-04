import { parse } from './commands/index.js';
import { SaltoolsError } from './errors/index.js';

function helloWorld() {
  console.log("Hello, World!")
}

const errors = { SaltoolsError };

export { 
  helloWorld, 
  parse,
  errors
};
