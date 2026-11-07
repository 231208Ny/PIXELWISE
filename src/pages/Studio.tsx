
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  RefreshCw,
  Zap,
} from "lucide-react";
import ImageUploader from "../components/ImageUploader";
import { compressImage } from "../engine/jpegPipeline";
import type { CompressionResult } from "../engine/jpegPipeline";

export default function Studio() {
  const [original, setOriginal] = useState<HTMLImageElement | null>(null);
  const [quality, setQuality] = useState(75);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!original) return;

    setProcessing(true);
    setError("");

    const timer = window.setTimeout(() => {
      try {
        const maxDimension = 512;
        const scale = Math.min(
          1,
          maxDimension / Math.max(original.naturalWidth, original.naturalHeight)
        );

        const width = Math.max(1, Math.round(original.naturalWidth * scale));
        const height = Math.max(1, Math.round(original.naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported by this browser.");
        }

        context.drawImage(original, 0, 0, width, height);

        const source = context.getImageData(0, 0, width, height);
        const compressed = compressImage(source, quality);

        setResult(compressed);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Image processing failed."
        );
        setResult(null);
      } finally {
        setProcessing(false);
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [original, quality]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  function resetStudio() {
    setOriginal(null);
    setResult(null);
    setQuality(75);
    setError("");
  }

  return (
    <div className="studio-page">
      <header className="studio-header">
        <a href="/" className="brand">
          <ArrowLeft size={19} />
          PIXELWISE
        </a>
        <span className="studio-label">COMPRESSION LAB</span>
      </header>

      <main className="studio-container">
        <div className="studio-heading">
          <span className="section-label">INTERACTIVE EXPERIMENT</span>
          <h1>Compression Studio</h1>
          <p>
            Change the quality and discover how mathematical
            transformations affect your image.
          </p>
        </div>

        {!original ? (
          <ImageUploader
            onImageLoaded={(image) => setOriginal(image)}
          />
        ) : (
          <>
            <div className="studio-toolbar">
              <span>
                <ImageIcon size={16} />
                Your experiment
              </span>

              <button
                type="button"
                className="reset-button"
                onClick={resetStudio}
              >
                <RefreshCw size={15} />
                New image
              </button>
            </div>

            <section className="comparison-grid">
              <div className="image-panel">
                <div className="panel-heading">
                  <span>ORIGINAL IMAGE</span>
                  <span className="panel-tag">SOURCE</span>
                </div>
                <img
                  src={original.src}
                  alt="Original uploaded image"
                />
              </div>

              <div className="image-panel">
                <div className="panel-heading">
                  <span>RECONSTRUCTED IMAGE</span>
                  <span className="panel-tag purple">PIXELWISE</span>
                </div>

                {result && (
                  <canvas
                    ref={(canvas) => {
                      if (!canvas || !result) return;

                      canvas.width = result.imageData.width;
                      canvas.height = result.imageData.height;

                      const context = canvas.getContext("2d");
                      context?.putImageData(result.imageData, 0, 0);
                    }}
                  />
                )}

                {processing && <p className="processing">Processing...</p>}
              </div>
            </section>

            <section className="quality-panel">
              <div className="quality-heading">
                <div>
                  <span className="section-label">CONTROL PANEL</span>
                  <h2>Image Quality</h2>
                </div>
                <strong>{quality}%</strong>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
              />

              <div className="range-labels">
                <span>More compression</span>
                <span>Higher quality</span>
              </div>
            </section>

            {error && <p className="error-message">{error}</p>}

            {result && (
              <section className="metrics-grid">
                <div className="metric-card">
                  <span>ORIGINAL PIXEL DATA</span>
                  <strong>{formatBytes(result.originalBytes)}</strong>
                </div>

                <div className="metric-card">
                  <span>PIXELWISE ENCODED DATA</span>
                  <strong>{formatBytes(result.encodedBytes)}</strong>
                </div>

                <div className="metric-card">
                  <span>DATA SIZE RATIO</span>
                  <strong>{result.compressionRatio.toFixed(2)}×</strong>
                </div>

                <div className="metric-card">
                  <span>BLOCKS PROCESSED</span>
                  <strong>{result.blocksProcessed}</strong>
                </div>
              </section>
            )}

            <div className="experiment-note">
              <Zap size={17} />
              <p>
                The image is processed locally. PIXELWISE currently
                uses its own JSON-based experimental encoding, not a
                standard JPEG file encoder.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
