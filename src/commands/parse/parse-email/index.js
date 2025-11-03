import EmailParser from './email-parser.js';


const emailParser = new EmailParser();

export const email = emailParser.parse.bind(emailParser);
export const configureEmailParser = emailParser.configure.bind(emailParser);
