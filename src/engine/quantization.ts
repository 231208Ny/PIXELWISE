
import type { Block8x8 } from "./dct";

// Standard JPEG luminance quantization table
export const LUMINANCE_TABLE: Block8x8 = [
  [16, 11, 10, 16, 24, 40, 51, 61],
  [12, 12, 14, 19, 26, 58, 60, 55],
  [14, 13, 16, 24, 40, 57, 69, 56],
  [14, 17, 22, 29, 51, 87, 80, 62],
  [18, 22, 37, 56, 68, 109, 103, 77],
  [24, 35, 55, 64, 81, 104, 113, 92],
  [49, 64, 78, 87, 103, 121, 120, 101],
  [72, 92, 95, 98, 112, 100, 103, 99],
];

// Standard JPEG chrominance quantization table
export const CHROMINANCE_TABLE: Block8x8 = [
  [17, 18, 24, 47, 99, 99, 99, 99],
  [18, 21, 26, 66, 99, 99, 99, 99],
  [24, 26, 56, 99, 99, 99, 99, 99],
  [47, 66, 99, 99, 99, 99, 99, 99],
  [99, 99, 99, 99, 99, 99, 99, 99],
  [99, 99, 99, 99, 99, 99, 99, 99],
  [99, 99, 99, 99, 99, 99, 99, 99],
  [99, 99, 99, 99, 99, 99, 99, 99],
];

// Convert user quality (1–100) into a JPEG-style scaling factor
export function getQuantizationScale(quality: number): number {
  const q = Math.max(1, Math.min(100, quality));

  return q < 50 ? 5000 / q : 200 - 2 * q;
}

// Generate a scaled quantization table
export function createQuantizationTable(
  quality: number,
  baseTable: Block8x8 = LUMINANCE_TABLE
): Block8x8 {
  const scale = getQuantizationScale(quality);

  return baseTable.map((row) =>
    row.map((value) =>
      Math.max(
        1,
        Math.min(255, Math.floor((value * scale + 50) / 100))
      )
    )
  );
}

// Quantize frequency coefficients
export function quantize(
  coefficients: Block8x8,
  table: Block8x8
): Block8x8 {
  return coefficients.map((row, i) =>
    row.map((value, j) => Math.round(value / table[i][j]))
  );
}

// Restore approximate frequency coefficients
export function dequantize(
  quantized: Block8x8,
  table: Block8x8
): Block8x8 {
  return quantized.map((row, i) =>
    row.map((value, j) => value * table[i][j])
  );
}
