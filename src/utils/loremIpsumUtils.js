// Common lorem ipsum text to generate from
const LOREM_IPSUM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "ut",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
];

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const generateWords = (length, startWithLorem = false) => {
  const words = Array(length)
    .fill()
    .map(() => getRandomElement(LOREM_IPSUM_WORDS));

  if (startWithLorem) {
    words.unshift("amet");
    words.unshift("sit");
    words.unshift("dolor");
    words.unshift("ipsum");
    words.unshift("lorem");
  }
  return words.slice(0, length).join(" ");
};

const generateSentences = (length, startWithLorem = false) => {
  return Array(length)
    .fill()
    .map((_, index) => {
      const wordsCount = Math.floor(Math.random() * 10) + 10; // 10-20 words per sentence
      const sentence = generateWords(wordsCount, startWithLorem && index === 0);
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    })
    .join(" ");
};

const generateParagraphs = (length, startWithLorem = false) => {
  return Array(length)
    .fill()
    .map((_, index) => {
      const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-6 sentences per paragraph
      return generateSentences(sentenceCount, startWithLorem && index === 0);
    })
    .join("\n\n");
};

export const generateLoremIpsum = (type, length, startWithLorem = false) => {
  try {
    switch (type) {
      case "words":
        return { success: true, value: generateWords(length, startWithLorem) };
      case "sentences":
        return {
          success: true,
          value: generateSentences(length, startWithLorem),
        };
      case "paragraphs":
        return {
          success: true,
          value: generateParagraphs(length, startWithLorem),
        };
      default:
        return { success: false, error: "Invalid generation type" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
