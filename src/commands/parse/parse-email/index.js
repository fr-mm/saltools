import EmailParser from './parse-email/email-parser.js';


const emailParser = new EmailParser();
export const email = emailParser.parse.bind(emailParser);
