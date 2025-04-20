import blinder from 'color-blind';

// Define simulation types with their descriptions
export const simulationTypes = [
  {
    id: 'protanopia',
    name: 'Protanopia',
    description: 'Red-blind (difficulty seeing reds)',
    simulate: blinder.protanopia,
  },
  {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Green-blind (difficulty seeing greens)',
    simulate: blinder.deuteranopia,
  },
  {
    id: 'tritanopia',
    name: 'Tritanopia',
    description: 'Blue-blind (difficulty seeing blues)',
    simulate: blinder.tritanopia,
  },
  {
    id: 'protanomaly',
    name: 'Protanomaly',
    description: 'Red-weak (less sensitive to red)',
    simulate: blinder.protanomaly,
  },
  {
    id: 'deuteranomaly',
    name: 'Deuteranomaly',
    description: 'Green-weak (less sensitive to green)',
    simulate: blinder.deuteranomaly,
  },
  {
    id: 'tritanomaly',
    name: 'Tritanomaly',
    description: 'Blue-weak (less sensitive to blue)',
    simulate: blinder.tritanomaly,
  },
  {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    description: 'Complete color blindness (only black, white, and gray)',
    simulate: blinder.achromatopsia,
  },
];

/**
 * Create an image element from a file
 * @param {File} file - Image file
 * @returns {Promise<HTMLImageElement>} Loaded image element
 */
const createImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Get pixel data from an image
 * @param {HTMLImageElement} img - Image element
 * @returns {ImageData} Image pixel data
 */
const getImageData = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

/**
 * Convert ImageData to base64 image URL
 * @param {ImageData} imageData - Image pixel data
 * @returns {string} Base64 image URL
 */
const imageDataToUrl = (imageData) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};

/**
 * Process each pixel of the image with a simulation function
 * @param {ImageData} imageData - Original image data
 * @param {Function} simulateFn - Color blindness simulation function
 * @returns {ImageData} Processed image data
 */
const processImageData = (imageData, simulateFn) => {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert RGB to hex
    const hex = '#' + 
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0');
    
    // Simulate color blindness
    const simulatedHex = simulateFn(hex);
    
    // Convert hex back to RGB
    const rgb = parseInt(simulatedHex.slice(1), 16);
    data[i] = (rgb >> 16) & 255;     // R
    data[i + 1] = (rgb >> 8) & 255;  // G
    data[i + 2] = rgb & 255;         // B
    // Alpha channel remains unchanged
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};

/**
 * Simulate color blindness on an image
 * @param {File} file - Image file
 * @param {string} type - Type of color blindness to simulate
 * @returns {Promise<string>} Base64 URL of simulated image
 */
export const simulateColorBlindness = async (file, type) => {
  try {
    const simulationType = simulationTypes.find(t => t.id === type);
    if (!simulationType) {
      throw new Error('Invalid simulation type');
    }

    const img = await createImage(file);
    const imageData = getImageData(img);
    const processedData = processImageData(imageData, simulationType.simulate);
    const resultUrl = imageDataToUrl(processedData);

    // Clean up
    URL.revokeObjectURL(img.src);

    return resultUrl;
  } catch (error) {
    console.error('Error simulating color blindness:', error);
    throw error;
  }
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {boolean} Whether the file is valid
 */
export const validateImageFile = (file, maxSize) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File must be a JPG, PNG, or WebP image');
  }

  return true;
};