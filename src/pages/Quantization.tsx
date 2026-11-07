
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  Activity,
  Grid3X3,
} from "lucide-react";

import { forwardDCT } from "../engine/dct";

import {
  LUMINANCE_TABLE,
  createQuantizationTable,
  quantize,
} from "../engine/quantization";

import "./Quantization.css";

function createSampleBlock() {
  return Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 8 }, (_, x) =>
      Math.round(
        128 +
        65 * Math.cos((x * Math.PI) / 7) +
        35 * Math.sin((y * Math.PI) / 5)
      )
    )
  );
}

function Quantization() {
  const [quality, setQuality] = useState(75);

  const pixels = useMemo(() => createSampleBlock(), []);

  const frequencies = useMemo(
    () => forwardDCT(pixels),
    [pixels]
  );

  const quantizationTable = useMemo(
    () => createQuantizationTable(quality, LUMINANCE_TABLE),
    [quality]
  );

  const quantized = useMemo(
    () => quantize(frequencies, quantizationTable),
    [frequencies, quantizationTable]
  );

  const maxFrequency = Math.max(
    ...frequencies.flat().map(Math.abs),
    1
  );

  const nonZeroCount = quantized
    .flat()
    .filter((value) => value !== 0).length;

  const retainedPercentage = Math.round(
    (nonZeroCount / 64) * 100
  );

  const getQualityLabel = () => {
    if (quality >= 85) return "High Quality";
    if (quality >= 50) return "Balanced";
    return "High Compression";
  };

  return (
    <main className="quant-page">

      <nav className="quant-nav">
        <a href="/microscope" className="quant-back">
          <ArrowLeft size={17} />
          Back to Microscope
        </a>

        <div className="quant-brand">
          <SlidersHorizontal size={19} />
          PIXELWISE / QUANTIZATION LAB
        </div>
      </nav>

      <section className="quant-heading">
        <span className="quant-eyebrow">
          PHASE 13 · JPEG MECHANISM
        </span>

        <h1>
          The Art of <span>Removing Detail.</span>
        </h1>

        <p>
          Discover how JPEG quantization reduces frequency
          precision to make image data more compact.
        </p>
      </section>

      <section className="quality-control">
        <div className="quality-header">
          <div>
            <span className="control-label">
              COMPRESSION QUALITY
            </span>

            <h2>{quality}%</h2>
            <p>{getQualityLabel()}</p>
          </div>

          <SlidersHorizontal size={30} />
        </div>

        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(event) =>
            setQuality(Number(event.target.value))
          }
          className="quality-slider"
        />

        <div className="slider-labels">
          <span>More Compression</span>
          <span>Higher Quality</span>
        </div>
      </section>

      <section className="quant-stats">
        <article>
          <span>NON-ZERO COEFFICIENTS</span>
          <strong>{nonZeroCount} / 64</strong>
        </article>

        <article>
          <span>ZERO COEFFICIENTS</span>
          <strong>{64 - nonZeroCount} / 64</strong>
        </article>

        <article>
          <span>COEFFICIENTS RETAINED</span>
          <strong>{retainedPercentage}%</strong>
        </article>
      </section>

      <section className="quant-matrices">

        <article className="quant-card">
          <div className="quant-card-heading">
            <Activity size={19} />
            <h2>Original DCT</h2>
          </div>

          <p>
            Frequency coefficients before quantization.
          </p>

          <div className="quant-grid">
            {frequencies.flat().map((value, index) => {
              const intensity = Math.abs(value) / maxFrequency;

              return (
                <div
                  key={index}
                  className="quant-cell original-cell"
                  style={{
                    background: `rgba(59, 130, 246, ${
                      0.12 + intensity * 0.88
                    })`,
                  }}
                  title={value.toFixed(2)}
                >
                  {Math.round(value)}
                </div>
              );
            })}
          </div>
        </article>

        <article className="quant-card">
          <div className="quant-card-heading">
            <Grid3X3 size={19} />
            <h2>Quantized DCT</h2>
          </div>

          <p>
            Coefficients after division and rounding.
          </p>

          <div className="quant-grid">
            {quantized.flat().map((value, index) => (
              <div
                key={index}
                className={`quant-cell ${
                  value === 0 ? "zero-cell" : "active-cell"
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        </article>

        <article className="quant-card">
          <div className="quant-card-heading">
            <SlidersHorizontal size={19} />
            <h2>Quantization Table</h2>
          </div>

          <p>
            Larger values mean stronger quantization.
          </p>

          <div className="quant-grid">
            {quantizationTable.flat().map((value, index) => (
              <div
                key={index}
                className="quant-cell table-cell"
              >
                {value}
              </div>
            ))}
          </div>
        </article>

      </section>

      <section className="quant-insight">
        <h2>Why does this matter?</h2>

        <p>
          Quantization divides each DCT coefficient by its
          corresponding quantization value and rounds the result.
          Small coefficients may become zero.
        </p>

        <p>
          These zeros are useful because the following JPEG
          encoding stages can represent long sequences of zeros
          efficiently using run-length encoding.
        </p>

        <div className="quant-formula">
          Quantized Coefficient = round(DCT Coefficient / Quantization Value)
        </div>
      </section>

      <footer className="quant-footer">
        PIXELWISE · Explore the mathematics behind compression.
      </footer>

    </main>
  );
}

export default Quantization;
