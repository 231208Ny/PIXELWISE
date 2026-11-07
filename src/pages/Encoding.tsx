
import { useMemo } from "react";
import {
  ArrowLeft,
  Binary,
  Layers3,
  ScanLine,
  FileCode2,
} from "lucide-react";

import { forwardDCT } from "../engine/dct";
import {
  LUMINANCE_TABLE,
  createQuantizationTable,
  quantize,
} from "../engine/quantization";
import { zigzagScan } from "../engine/zigzag";
import { encodeRLE } from "../engine/runLength";

import "./Encoding.css";

function createSampleBlock(): number[][] {
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

function Encoding() {
  const result = useMemo(() => {
    const pixels = createSampleBlock();

    const dct = forwardDCT(pixels);

    const table = createQuantizationTable(
      50,
      LUMINANCE_TABLE
    );

    const quantized = quantize(dct, table);

    const zigzag = zigzagScan(quantized);

    const encoded = encodeRLE(zigzag);

    return {
      pixels,
      quantized,
      zigzag,
      encoded,
    };
  }, []);

  const zeroCount = result.zigzag
    .slice(1)
    .filter((value) => value === 0).length;

  const nonZeroCount = result.zigzag
    .slice(1)
    .filter((value) => value !== 0).length;

  const tokenCount = result.encoded.length;

  const reduction = result.zigzag.length > 0
    ? Math.round(
        (1 - tokenCount / result.zigzag.length) * 100
      )
    : 0;

  return (
    <main className="encoding-page">

      {/* NAVIGATION */}
      <nav className="encoding-nav">
        <a href="/quantization" className="encoding-back">
          <ArrowLeft size={17} />
          Back to Quantization
        </a>

        <div className="encoding-brand">
          <Binary size={20} />
          PIXELWISE / ENCODING LAB
        </div>
      </nav>

      {/* HEADING */}
      <section className="encoding-heading">
        <span className="encoding-eyebrow">
          PHASE 14 · DATA REPRESENTATION
        </span>

        <h1>
          From Frequencies to <span>Compact Data.</span>
        </h1>

        <p>
          Discover how JPEG rearranges frequency coefficients
          and represents repeated zeros efficiently.
        </p>
      </section>

      {/* PROCESS FLOW */}
      <section className="encoding-flow">
        <article className="encoding-step">
          <Layers3 size={22} />
          <span>01</span>
          <h3>Quantized Data</h3>
          <p>Frequency coefficients after quantization.</p>
        </article>

        <article className="encoding-step">
          <ScanLine size={22} />
          <span>02</span>
          <h3>Zigzag Scan</h3>
          <p>Rearrange coefficients from low to high frequency.</p>
        </article>

        <article className="encoding-step">
          <Binary size={22} />
          <span>03</span>
          <h3>Run-Length Encoding</h3>
          <p>Represent consecutive zeros using run-length pairs.</p>
        </article>
      </section>

      {/* STATISTICS */}
      <section className="encoding-stats">
        <article>
          <span>AC ZERO COEFFICIENTS</span>
          <strong>{zeroCount}</strong>
        </article>

        <article>
          <span>AC NON-ZERO COEFFICIENTS</span>
          <strong>{nonZeroCount}</strong>
        </article>

        <article>
          <span>RLE TOKENS</span>
          <strong>{tokenCount}</strong>
        </article>

        <article>
          <span>TOKEN COUNT REDUCTION</span>
          <strong>{reduction}%</strong>
        </article>
      </section>

      {/* ZIGZAG */}
      <section className="encoding-card">
        <div className="encoding-card-heading">
          <ScanLine size={20} />
          <h2>Zigzag Sequence</h2>
        </div>

        <p>
          The 8 × 8 matrix is read in a zigzag order.
          Lower-frequency coefficients appear first.
        </p>

        <div className="sequence-grid">
          {result.zigzag.map((value, index) => (
            <div
              key={index}
              className={`sequence-cell ${
                value === 0 ? "sequence-zero" : "sequence-active"
              }`}
              title={`Position ${index + 1}: ${value}`}
            >
              {value}
            </div>
          ))}
        </div>

        <div className="sequence-legend">
          <span>
            <i className="legend-active" />
            Non-zero coefficient
          </span>

          <span>
            <i className="legend-zero" />
            Zero coefficient
          </span>
        </div>
      </section>

      {/* RLE OUTPUT */}
      <section className="encoding-card">
        <div className="encoding-card-heading">
          <Binary size={20} />
          <h2>Run-Length Encoding Output</h2>
        </div>

        <p>
          Each pair records the number of preceding zeros
          and the next non-zero value. Special markers can
          represent long zero runs and the end of a block.
        </p>

        <div className="rle-list">
          {result.encoded.map((pair, index) => (
            <div className="rle-item" key={index}>
              <span className="rle-index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <span className="rle-label">ZEROS</span>
                <strong>{pair.zeros}</strong>
              </div>

              <div>
                <span className="rle-label">VALUE</span>
                <strong>{pair.value}</strong>
              </div>

              <span className="rle-pair">
                ({pair.zeros}, {pair.value})
              </span>
            </div>
          ))}

          {result.encoded.length === 0 && (
            <p className="empty-rle">
              No AC encoding tokens were generated.
            </p>
          )}
        </div>
      </section>

      {/* INSIGHT */}
      <section className="encoding-insight">
        <FileCode2 size={24} />

        <h2>Why is this useful?</h2>

        <p>
          Quantization often turns many high-frequency
          coefficients into zero. Zigzag scanning groups
          many of these zeros toward the end of the sequence.
          Run-length encoding can then describe zero runs
          without listing every zero individually.
        </p>

        <p>
          This page demonstrates the zigzag and RLE stages.
          It does not yet perform the complete JPEG entropy
          coding process or generate a standard JPEG file.
        </p>
      </section>

      <footer className="encoding-footer">
        PIXELWISE · Understanding how image data is represented.
      </footer>

    </main>
  );
}

export default Encoding;
