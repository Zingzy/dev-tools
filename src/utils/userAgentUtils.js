import {
	getPattern,
	isbot,
	isbotMatch,
	isbotMatches,
	isbotNaive,
	isbotPattern,
} from "isbot";
import { UAParser } from "ua-parser-js";

// Parses a user agent string and provides detailed bot information.
export const parseUserAgent = (userAgentString) => {
	const parser = new UAParser(userAgentString);
	const result = parser.getResult();

	const botCheck = isbot(userAgentString);
	const naiveBotCheck = isbotNaive(userAgentString);
	const botRegexPattern = getPattern().toString();
	const matchedSubstring = isbotMatch(userAgentString);
	const allMatchedSubstrings = isbotMatches(userAgentString);
	const patternStringMatch = isbotPattern(userAgentString);

	return {
		...result,
		isBot: botCheck,
		isBotNaive: naiveBotCheck,
		botRegexPattern: botRegexPattern,
		matchedSubstring: matchedSubstring,
		allMatchedSubstrings: allMatchedSubstrings,
		patternStringMatch: patternStringMatch,
	};
};
