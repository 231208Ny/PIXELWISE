
import { rgbToYCbCr, yCbCrToRGB } from "./colorSpace";
import { forwardDCT, inverseDCT, type Block8x8 } from "./dct";
import {
  createQuantizationTable,
  LUMINANCE_TABLE,
  CHROMINANCE_TABLE,
  quantize,
  dequantize,
} from "./quantization";
import { zigzagScan } from "./zigzag";
import { encodeRLE } from "./runLength";

export interface CompressionResult {
  imageData: ImageData;
  originalBytes: number;
  encodedBytes: number;
  compressionRatio: number;
  quality: number;
  blocksProcessed: number;
}

function createPlane(width: number, height: number): number[][] {
  return Array.from({ length: height }, () => Array(width).fill(0));
}

function getBlock(
  plane: number[][],
  startX: number,
  startY: number,
  width: number,
  height: number
): Block8x8 {
  return Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 8 }, (_, x) => {
      const sourceX = Math.min(startX + x, width - 1);
      const sourceY = Math.min(startY + y, height - 1);
      return plane[sourceY][sourceX];
    })
  );
}

function processComponent(
  plane: number[][],
  width: number,
  height: number,
  table: Block8x8
) {
  const reconstructed = createPlane(width, height);
  const encodedBlocks: unknown[] = [];
  let blocksProcessed = 0;

  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 8) {
      const block = getBlock(plane, x, y, width, height);

      const frequencies = forwardDCT(block);
      const quantized = quantize(frequencies, table);

      const zigzag = zigzagScan(quantized);
      const dc = zigzag[0];
      const ac = encodeRLE(zigzag);

      encodedBlocks.push({
        dc,
        ac: ac.map((pair) => [pair.zeros, pair.value]),
      });

      const restoredFrequencies = dequantize(quantized, table);
      const restoredBlock = inverseDCT(restoredFrequencies);

      for (let by = 0; by < 8; by++) {
        for (let bx = 0; bx < 8; bx++) {
          const targetY = y + by;
          const targetX = x + bx;

          if (targetY < height && targetX < width) {
            reconstructed[targetY][targetX] = restoredBlock[by][bx];
          }
        }
      }

      blocksProcessed++;
    }
  }

  return {
    reconstructed,
    encodedBlocks,
    blocksProcessed,
  };
}

export function compressImage(
  source: ImageData,
  quality: number
): CompressionResult {
  const { width, height, data } = source;

  if (width === 0 || height === 0) {
    throw new Error("Image dimensions must be greater than zero.");
  }

  const yPlane = createPlane(width, height);
  const cbPlane = createPlane(width, height);
  const crPlane = createPlane(width, height);

  // Convert every source pixel from RGB into YCbCr
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      const color = rgbToYCbCr({
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
      });

      yPlane[y][x] = color.y;
      cbPlane[y][x] = color.cb;
      crPlane[y][x] = color.cr;
    }
  }

  const luminanceTable = createQuantizationTable(
    quality,
    LUMINANCE_TABLE
  );

  const chrominanceTable = createQuantizationTable(
    quality,
    CHROMINANCE_TABLE
  );

  // Process the three color components independently
  const yResult = processComponent(
    yPlane,
    width,
    height,
    luminanceTable
  );

  const cbResult = processComponent(
    cbPlane,
    width,
    height,
    chrominanceTable
  );

  const crResult = processComponent(
    crPlane,
    width,
    height,
    chrominanceTable
  );

  const output = new ImageData(width, height);

  // Reconstruct the processed YCbCr pixels back into RGB
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      const rgb = yCbCrToRGB({
        y: yResult.reconstructed[y][x],
        cb: cbResult.reconstructed[y][x],
        cr: crResult.reconstructed[y][x],
      });

      output.data[index] = Math.round(rgb.r);
      output.data[index + 1] = Math.round(rgb.g);
      output.data[index + 2] = Math.round(rgb.b);
      output.data[index + 3] = data[index + 3];
    }
  }

  // PIXELWISE custom JSON representation, not a JPEG bitstream
  const encodedRepresentation = {
    format: "PIXELWISE-DEMO-1",
    width,
    height,
    quality,
    components: {
      y: yResult.encodedBlocks,
      cb: cbResult.encodedBlocks,
      cr: crResult.encodedBlocks,
    },
  };

  const encodedBytes = new TextEncoder().encode(
    JSON.stringify(encodedRepresentation)
  ).length;

  const originalBytes = data.length;

  return {
    imageData: output,
    originalBytes,
    encodedBytes,
    compressionRatio:
      encodedBytes > 0 ? originalBytes / encodedBytes : 0,
    quality,
    blocksProcessed:
      yResult.blocksProcessed +
      cbResult.blocksProcessed +
      crResult.blocksProcessed,
  };
}
