// Convert hex color to RGB object
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Convert RGB values to HSL color
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// Generate shades of a color
export const generateColorShades = (hex, steps = 6) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];

  const shades = [];
  for (let i = 0; i <= 100; i += 100 / (steps - 1)) {
    const shade = {
      r: Math.round(rgb.r * (1 - i / 100)),
      g: Math.round(rgb.g * (1 - i / 100)),
      b: Math.round(rgb.b * (1 - i / 100)),
    };
    shades.push(
      "#" +
        shade.r.toString(16).padStart(2, "0") +
        shade.g.toString(16).padStart(2, "0") +
        shade.b.toString(16).padStart(2, "0"),
    );
  }
  return shades;
};

// Format color based on specified format
export const formatColor = (hex, format) => {
  // valid formats: 'hex', 'rgb', 'hsl'
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  switch (format) {
    case "hex":
      return hex;
    case "rgb":
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case "hsl": {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    default:
      return hex;
  }
};
