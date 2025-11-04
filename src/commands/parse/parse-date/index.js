import { DateParser } from './date-parser.js';

const dateParser = new DateParser();
export const date = new DateParser().parse.bind(dateParser);
