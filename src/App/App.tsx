import { useState } from "react";
import axios from "axios";

import "./App.scss";

interface ImageResponse {
  croppedImage: string;
  basnetOutput: string;
  deeplabOutput: string;
}

export const App = () => {
  const [pending, setPending] = useState(false);
  const [imageHistory, setImageHistory] = useState<ImageResponse[]>([]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setPending(true);
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://77.68.31.93/process-image",
        // "http://127.0.0.1:8000/process-image",
        new FormData(event.currentTarget),
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImageHistory([...imageHistory, response.data]);
      setPending(false);
    } catch (error) {
      alert("Error uploading image: " + error);
      setPending(false);
    }
  };
  return (
    <div className="app">
      <div>✂️🖼️✂️ </div>
      <form className="image-form" onSubmit={handleSubmit}>
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          required
          disabled={pending}
        />
        <button type="submit" disabled={pending}>
          {pending ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div className="image-history">
        {imageHistory
          .map((images, index) => (
            <div className="image-bundle" key={index}>
              <div>
                <img
                  src={`data:image/jpeg;base64,${images.croppedImage}`}
                  alt="Cropped"
                />
              </div>
              <div>
                <img
                  src={`data:image/jpeg;base64,${images.basnetOutput}`}
                  alt="BasNet Output"
                />
              </div>
              <div>
                <img
                  src={`data:image/jpeg;base64,${images.deeplabOutput}`}
                  alt="BasNet Output"
                />
              </div>
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
};
