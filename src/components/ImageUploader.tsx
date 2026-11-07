
import { useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageLoaded: (image: HTMLImageElement) => void;
}

export default function ImageUploader({
  onImageLoaded,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      onImageLoaded(image);
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      alert("Unable to load this image.");
    };

    image.src = objectUrl;
  }

  return (
    <div className="upload-card">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="upload-icon">
        <Upload size={25} />
      </div>

      <h3>Upload your image</h3>

      <p>
        Choose a photo from your device to explore how
        image compression works.
      </p>

      <button
        className="primary-button"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon size={17} />
        Choose Image
      </button>

      <span className="upload-hint">
        JPG, PNG, WebP · Processed locally in your browser
      </span>
    </div>
  );
}
