import EmailParser from './email-parser.js';


const emailParser = new EmailParser();
export const email = emailParser.parse.bind(emailParser);
