import DateParser from './parse-date.js';

const dateParser = new DateParser();
export const date = new DateParser().parse.bind(dateParser);
