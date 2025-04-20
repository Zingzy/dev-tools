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

// Create an image element from a file
const createImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};


// Get pixel data from an image
const getImageData = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};


// Convert ImageData to base64 image URL
const imageDataToUrl = (imageData) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};

// Process each pixel of the image with a simulation function
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


// Simulate color blindness on an image
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
