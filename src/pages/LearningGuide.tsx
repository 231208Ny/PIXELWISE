
import {
  ArrowLeft,
  ArrowRight,
  Image,
  Palette,
  Grid3X3,
  SlidersHorizontal,
  ScanLine,
  Binary,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

import "./LearningGuide.css";

const stages = [
  {
    number: "01",
    title: "Start with an Image",
    subtitle: "Pixels",
    icon: Image,
    explanation:
      "A digital image is made of pixels. Each pixel stores color information, commonly represented using red, green, and blue values.",
    insight:
      "A photo is not stored as one single picture object. It is represented by numerical information.",
    link: "/studio",
    action: "Open Studio",
  },
  {
    number: "02",
    title: "Separate Brightness and Color",
    subtitle: "RGB to YCbCr",
    icon: Palette,
    explanation:
      "JPEG-style compression can transform RGB information into YCbCr components. Y represents brightness, while Cb and Cr represent color-difference information.",
    insight:
      "Brightness and color can be processed separately.",
    link: "/studio",
    action: "Explore the Image",
  },
  {
    number: "03",
    title: "Analyze Small Blocks",
    subtitle: "8 × 8 DCT",
    icon: Grid3X3,
    explanation:
      "An 8 × 8 block of image samples can be transformed into frequency coefficients using the Discrete Cosine Transform.",
    insight:
      "The coefficients describe image patterns at different spatial frequencies.",
    link: "/microscope",
    action: "Open Microscope",
  },
  {
    number: "04",
    title: "Reduce Less Important Detail",
    subtitle: "Quantization",
    icon: SlidersHorizontal,
    explanation:
      "Quantization divides frequency coefficients by values in a quantization table and rounds the results. Higher-frequency information is often quantized more strongly.",
    insight:
      "Changing quantization strength affects both the data representation and reconstructed image quality.",
    link: "/quantization",
    action: "Open Quantization Lab",
  },
  {
    number: "05",
    title: "Rearrange the Coefficients",
    subtitle: "Zigzag Scan",
    icon: ScanLine,
    explanation:
      "The quantized 8 × 8 coefficients are read in a zigzag order, placing low-frequency coefficients near the beginning and higher-frequency coefficients later.",
    insight:
      "This ordering helps group many zero-valued coefficients toward the end.",
    link: "/encoding",
    action: "Open Encoding Lab",
  },
  {
    number: "06",
    title: "Represent Repeated Zeros Efficiently",
    subtitle: "Run-Length Encoding",
    icon: Binary,
    explanation:
      "Run-length encoding represents a sequence by recording how many zeros appear before the next non-zero coefficient. JPEG also uses additional coding stages beyond this demonstration.",
    insight:
      "A long sequence of zeros can be represented more compactly than listing every zero individually.",
    link: "/encoding",
    action: "Inspect RLE",
  },
];

function LearningGuide() {
  return (
    <main className="guide-page">
      <nav className="guide-nav">
        <a href="/" className="guide-back">
          <ArrowLeft size={17} />
          Back to PIXELWISE
        </a>

        <span className="guide-brand">PIXELWISE / LEARNING GUIDE</span>
      </nav>

      <header className="guide-hero">
        <span className="guide-eyebrow">
          YOUR COMPRESSION JOURNEY
        </span>

        <h1>
          From Pixels
          <br />
          to <span>Compact Data.</span>
        </h1>

        <p>
          Follow the stages to understand how JPEG-inspired
          image compression transforms visual information
          into a more compact representation.
        </p>

        <a href="/studio" className="guide-primary">
          Start Experimenting
          <ArrowRight size={17} />
        </a>
      </header>

      <section className="guide-timeline">
        {stages.map((stage, index) => {
          const StageIcon = stage.icon;

          return (
            <article className="guide-stage" key={stage.number}>
              <div className="guide-stage-marker">
                <span>{stage.number}</span>
                {index !== stages.length - 1 && (
                  <div className="guide-stage-line" />
                )}
              </div>

              <div className="guide-stage-card">
                <div className="guide-stage-top">
                  <div className="guide-stage-icon">
                    <StageIcon size={22} />
                  </div>

                  <span>{stage.subtitle}</span>
                </div>

                <h2>{stage.title}</h2>

                <p>{stage.explanation}</p>

                <div className="guide-insight">
                  <Lightbulb size={18} />
                  <div>
                    <strong>Key insight</strong>
                    <p>{stage.insight}</p>
                  </div>
                </div>

                <a href={stage.link} className="guide-stage-link">
                  {stage.action}
                  <ArrowRight size={15} />
                </a>
              </div>
            </article>
          );
        })}
      </section>

      <section className="guide-summary">
        <CheckCircle2 size={27} />

        <h2>The big picture</h2>

        <p>
          Image compression is a sequence of mathematical
          and data-processing operations. Each stage changes
          how image information is represented. The complete
          JPEG standard includes additional steps, such as
          chroma subsampling options, DC coefficient
          differential coding, and entropy coding.
        </p>

        <a href="/studio" className="guide-primary">
          Try PIXELWISE Again
          <ArrowRight size={17} />
        </a>
      </section>

      <footer className="guide-footer">
        PIXELWISE · Unveiling Technology · Global Hackathon 2026
      </footer>
    </main>
  );
}

export default LearningGuide;
