
export interface RLEPair {
  zeros: number;
  value: number;
}

// Run-Length Encoding for quantized AC coefficients.
// The first value is the DC coefficient and is kept separate.
export function encodeRLE(values: number[]): RLEPair[] {
  if (values.length !== 64) {
    throw new Error("Expected exactly 64 zigzag coefficients.");
  }

  const result: RLEPair[] = [];
  let zeroCount = 0;

  for (let i = 1; i < values.length; i++) {
    const value = values[i];

    if (value === 0) {
      zeroCount++;
    } else {
      while (zeroCount >= 16) {
        // JPEG ZRL: represents 16 consecutive zero AC coefficients
        result.push({ zeros: 15, value: 0 });
        zeroCount -= 16;
      }

      result.push({
        zeros: zeroCount,
        value,
      });

      zeroCount = 0;
    }
  }

  // JPEG EOB: remaining AC coefficients are all zero
  if (zeroCount > 0 || result.length === 0) {
    result.push({ zeros: 0, value: 0 });
  }

  return result;
}

// Reconstruct the 64 coefficients from RLE pairs
export function decodeRLE(pairs: RLEPair[], dcValue: number): number[] {
  const result = Array(64).fill(0);
  result[0] = dcValue;

  let index = 1;

  for (const pair of pairs) {
    if (pair.zeros === 0 && pair.value === 0) {
      break;
    }

    if (pair.zeros === 15 && pair.value === 0) {
      index += 16;
      continue;
    }

    index += pair.zeros;

    if (index >= 64) {
      break;
    }

    result[index] = pair.value;
    index++;
  }

  return result;
}
