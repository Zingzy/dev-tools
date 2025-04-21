import { UAParser } from 'ua-parser-js';


// Parses a user agent string.
export const parseUserAgent = (userAgentString) => {
  const parser = new UAParser(userAgentString);
  return parser.getResult();
};