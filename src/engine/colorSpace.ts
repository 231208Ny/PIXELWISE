
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface YCbCr {
  y: number;
  cb: number;
  cr: number;
}

// Convert RGB color into YCbCr color space
export function rgbToYCbCr({ r, g, b }: RGB): YCbCr {
  return {
    y: 0.299 * r + 0.587 * g + 0.114 * b,
    cb: 128 - 0.168736 * r - 0.331264 * g + 0.5 * b,
    cr: 128 + 0.5 * r - 0.418688 * g - 0.081312 * b,
  };
}

// Convert YCbCr back into RGB
export function yCbCrToRGB({ y, cb, cr }: YCbCr): RGB {
  return {
    r: Math.max(0, Math.min(255, y + 1.402 * (cr - 128))),
    g: Math.max(0, Math.min(255, y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128))),
    b: Math.max(0, Math.min(255, y + 1.772 * (cb - 128))),
  };
}
