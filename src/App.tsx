
import {
  Aperture,
  ArrowRight,
  Image as ImageIcon,
  Layers3,
  Microscope,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

import Studio from "./pages/Studio";
import MicroscopePage from "./pages/Microscope";
import QuantizationPage from "./pages/Quantization";
import EncodingPage from "./pages/Encoding";
import LearningGuide from "./pages/LearningGuide";

import "./App.css";

function App() {
  const path = window.location.pathname;

  if (path === "/studio") return <Studio />;
  if (path === "/microscope") return <MicroscopePage />;
  if (path === "/quantization") return <QuantizationPage />;
  if (path === "/encoding") return <EncodingPage />;
  if (path === "/guide") return <LearningGuide />;

  return (
    <div className="app">
      <nav className="navbar">
        <a href="/" className="logo">
          <div className="logo-icon">
            <Aperture size={21} />
          </div>
          <span>PIXELWISE</span>
        </a>

        <div className="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#technology">Technology</a>
          <a href="/guide">Learning Guide</a>
          <a href="/studio" className="nav-cta">
            Open Studio <ArrowRight size={15} />
          </a>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>UNVEILING TECHNOLOGY</span>
            </div>

            <h1>
              Every Photo
              <br />
              Has a <span>Secret.</span>
              <br />
              Let's Decode It.
            </h1>

            <p className="hero-description">
              Ever wondered how your photos become smaller
              without losing everything you see?
              <br />
              Discover the hidden science behind image
              compression through an interactive visual experience.
            </p>

            <div className="hero-actions">
              <a href="/studio" className="primary-button">
                Explore the Studio
                <ArrowRight size={18} />
              </a>

              <a href="#how-it-works" className="secondary-button">
                Discover the Science
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>8 × 8</strong>
                <span>Pixel Blocks</span>
              </div>

              <div>
                <strong>DCT</strong>
                <span>Frequency Transform</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Interactive Learning</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="visual-card">
              <div className="visual-header">
                <div className="visual-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>PIXEL ANALYSIS</span>
              </div>

              <div className="pixel-grid">
                {Array.from({ length: 64 }).map((_, index) => (
                  <div
                    key={index}
                    className="pixel"
                    style={{
                      opacity: 0.2 + ((index * 17) % 80) / 100,
                    }}
                  />
                ))}
              </div>

              <div className="visual-footer">
                <div>
                  <span className="visual-label">BLOCK SIZE</span>
                  <strong>8 × 8</strong>
                </div>

                <div>
                  <span className="visual-label">PROCESS</span>
                  <strong>TRANSFORMING</strong>
                </div>
              </div>
            </div>

            <div className="floating-card floating-top">
              <Zap size={16} />
              <span>Frequency Analysis</span>
            </div>

            <div className="floating-card floating-bottom">
              <Layers3 size={16} />
              <span>Quantization</span>
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="section-eyebrow">
              BEHIND EVERY IMAGE
            </span>

            <h2>
              What happens inside
              <br />
              <span>a compressed photo?</span>
            </h2>

            <p>
              A photo is more than millions of colored pixels.
              Behind the scenes, mathematical operations
              transform the way image data is represented.
            </p>
          </div>

          <div className="process-grid">
            <article className="process-card">
              <div className="process-icon">
                <ImageIcon size={23} />
              </div>

              <span className="process-number">01</span>
              <h3>Color Transformation</h3>

              <p>
                RGB colors are transformed into YCbCr,
                separating brightness information from
                color information.
              </p>
            </article>

            <article className="process-card">
              <div className="process-icon">
                <Microscope size={23} />
              </div>

              <span className="process-number">02</span>
              <h3>Discrete Cosine Transform</h3>

              <p>
                Each 8 × 8 pixel block is converted into
                frequency information to reveal visual patterns.
              </p>
            </article>

            <article className="process-card">
              <div className="process-icon">
                <SlidersHorizontal size={23} />
              </div>

              <span className="process-number">03</span>
              <h3>Quantization</h3>

              <p>
                Less important frequency information is reduced,
                allowing image data to become more compact.
              </p>
            </article>
          </div>
        </section>

        <section className="technology-section" id="technology">
          <div className="technology-content">
            <span className="section-eyebrow">
              LEARN BY EXPERIMENTING
            </span>

            <h2>
              Don't just read
              <br />
              <span>about technology.</span>
              <br />
              Experience it.
            </h2>

            <p>
              Change compression quality, inspect frequency
              coefficients, and compare reconstructed images.
              Every interaction reveals something happening
              inside the compression process.
            </p>

            <a href="/studio" className="primary-button">
              Enter PIXELWISE Studio
              <ArrowRight size={18} />
            </a>

            <a href="/guide" className="home-guide-link">
              Or explore the complete learning guide
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="technology-preview">
            <div className="preview-top">
              <span>COMPRESSION LAB</span>

              <span className="live-indicator">
                <span />
                INTERACTIVE
              </span>
            </div>

            <div className="preview-content">
              <div className="preview-block">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="preview-pixel"
                    style={{
                      opacity: 0.25 + ((i * 23) % 70) / 100,
                    }}
                  />
                ))}
              </div>

              <div className="preview-info">
                <div>
                  <span>TRANSFORM</span>
                  <strong>DCT-II</strong>
                </div>

                <div>
                  <span>BLOCK SIZE</span>
                  <strong>8 × 8</strong>
                </div>

                <div>
                  <span>QUALITY</span>
                  <strong>ADJUSTABLE</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="/" className="logo">
          <div className="logo-icon">
            <Aperture size={18} />
          </div>
          <span>PIXELWISE</span>
        </a>

        <p>
          Unveiling the science hidden inside everyday technology.
        </p>

        <span className="footer-credit">
          Built for Global Hackathon 2026
        </span>
      </footer>
    </div>
  );
}

export default App;
