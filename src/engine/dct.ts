
export type Block8x8 = number[][];

const N = 8;

// DCT-II: transform an 8x8 pixel block into frequency coefficients
export function forwardDCT(block: Block8x8): Block8x8 {
  const result: Block8x8 = Array.from(
    { length: N },
    () => Array(N).fill(0)
  );

  for (let u = 0; u < N; u++) {
    for (let v = 0; v < N; v++) {
      let sum = 0;

      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          const pixel = block[x][y] - 128;

          sum +=
            pixel *
            Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 16);
        }
      }

      const cu = u === 0 ? 1 / Math.sqrt(2) : 1;
      const cv = v === 0 ? 1 / Math.sqrt(2) : 1;

      result[u][v] = 0.25 * cu * cv * sum;
    }
  }

  return result;
}

// Inverse DCT: reconstruct an 8x8 pixel block
export function inverseDCT(coefficients: Block8x8): Block8x8 {
  const result: Block8x8 = Array.from(
    { length: N },
    () => Array(N).fill(0)
  );

  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      let sum = 0;

      for (let u = 0; u < N; u++) {
        for (let v = 0; v < N; v++) {
          const cu = u === 0 ? 1 / Math.sqrt(2) : 1;
          const cv = v === 0 ? 1 / Math.sqrt(2) : 1;

          sum +=
            cu *
            cv *
            coefficients[u][v] *
            Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 16);
        }
      }

      result[x][y] = Math.max(0, Math.min(255, sum * 0.25 + 128));
    }
  }

  return result;
}
