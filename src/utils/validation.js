import { isEmpty } from "./common";

// validate if a string is a valid Base64 encoded string
export const isValidBase64 = (str) => {
  if (isEmpty(str)) return false;
  try {
    return btoa(atob(str)) === str;
  } catch (error) {
    return false;
  }
};

// validate Hex strings
export const isValidHexColor = (color) => {
  if (isEmpty(color)) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// validate rgb color values
export const isValidRGB = (r, g, b) => {
  const isValidChannel = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 255;
  };

  return isValidChannel(r) && isValidChannel(g) && isValidChannel(b);
};

// validate hsl color values
export const isValidHSL = (h, s, l) => {
  const isValidHue = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 360;
  };

  const isValidPercentage = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  return isValidHue(h) && isValidPercentage(s) && isValidPercentage(l);
};
