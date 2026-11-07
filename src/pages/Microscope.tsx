
import { useMemo, useState } from "react";

import {
  ArrowLeft,
  Microscope as MicroscopeIcon,
  Grid3X3,
} from "lucide-react";

import { forwardDCT } from "../engine/dct";
import "./Microscope.css";

// Generate sample 8x8 pixel blocks
const createSampleBlock = (pattern: string): number[][] => {
  return Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 8 }, (_, x) => {
      if (pattern === "gradient") {
        return 30 + x * 22 + y * 10;
      }

      if (pattern === "checkerboard") {
        return (x + y) % 2 === 0 ? 230 : 25;
      }

      return x < 4 ? 220 : 35;
    })
  );
};

function Microscope() {
  const [pattern, setPattern] = useState("gradient");

  // Generate pixel values
  const pixels = useMemo(
    () => createSampleBlock(pattern),
    [pattern]
  );

  // Apply Discrete Cosine Transform
  const frequencies = useMemo(
    () => forwardDCT(pixels),
    [pixels]
  );

  // Find maximum coefficient for visualization
  const maxFrequency = Math.max(
    ...frequencies.flat().map((value) => Math.abs(value)),
    1
  );

  return (
    <main className="microscope-page">

      {/* NAVIGATION */}
      <nav className="micro-nav">
        <a href="/studio" className="micro-back">
          <ArrowLeft size={17} />
          Back to Studio
        </a>

        <div className="micro-brand">
          <MicroscopeIcon size={20} />
          PIXELWISE / FREQUENCY MICROSCOPE
        </div>
      </nav>

      {/* PAGE HEADING */}
      <section className="micro-heading">
        <span className="micro-eyebrow">
          PHASE 12 · DCT EXPLORATION
        </span>

        <h1>
          Look Inside a <span>Pixel Block.</span>
        </h1>

        <p>
          Explore how an 8 × 8 block of pixels transforms
          into mathematical frequency coefficients.
        </p>
      </section>

      {/* PATTERN SELECTOR */}
      <section className="micro-controls">
        <label htmlFor="pattern-select">
          Choose a pixel pattern
        </label>

        <select
          id="pattern-select"
          value={pattern}
          onChange={(event) => setPattern(event.target.value)}
        >
          <option value="gradient">
            Smooth Gradient
          </option>

          <option value="checkerboard">
            Checkerboard
          </option>

          <option value="vertical">
            Vertical Split
          </option>
        </select>
      </section>

      {/* PIXEL AND FREQUENCY VISUALIZATION */}
      <section className="micro-grid-layout">

        {/* SPATIAL DOMAIN */}
        <article className="micro-card">
          <div className="micro-card-heading">
            <Grid3X3 size={18} />
            <h2>Spatial Domain</h2>
          </div>

          <p>
            Original grayscale pixel values (0–255).
          </p>

          <div className="number-grid">
            {pixels.flat().map((value, index) => (
              <div
                key={index}
                className="number-cell"
                style={{
                  background: `rgb(${value}, ${value}, ${value})`,
                  color: value > 145 ? "#111827" : "#ffffff",
                }}
              >
                {Math.round(value)}
              </div>
            ))}
          </div>
        </article>

        {/* FREQUENCY DOMAIN */}
        <article className="micro-card">
          <div className="micro-card-heading">
            <MicroscopeIcon size={18} />
            <h2>Frequency Domain</h2>
          </div>

          <p>
            DCT coefficients reveal the image's frequency patterns.
          </p>

          <div className="number-grid frequency-grid">
            {frequencies.flat().map((value, index) => {
              const intensity = Math.min(
                Math.abs(value) / maxFrequency,
                1
              );

              return (
                <div
                  key={index}
                  className="frequency-cell"
                  style={{
                    background: `rgba(139, 92, 246, ${
                      0.12 + intensity * 0.88
                    })`,
                  }}
                  title={`Coefficient: ${value.toFixed(2)}`}
                >
                  {Math.round(value)}
                </div>
              );
            })}
          </div>
        </article>

      </section>

      {/* INSIGHT SECTION */}
      <section className="micro-insight">
        <h2>What should you notice?</h2>

        <p>
          The top-left coefficient represents the average
          brightness (DC component). Other cells represent
          different horizontal and vertical frequency patterns
          (AC components).
        </p>

        <p>
          Smooth patterns generally concentrate more energy
          in lower frequencies, while rapidly changing patterns
          can produce stronger higher-frequency coefficients.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="micro-footer">
        <span>PIXELWISE</span>
        <span>Understanding image compression, one block at a time.</span>
      </footer>

    </main>
  );
}

export default Microscope;
