"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal

  // Additional parameters for fine-tuning
  const [imageSize, setImageSize] = useState("landscape_4_3");
  const [numInferenceSteps, setNumInferenceSteps] = useState(28);
  const [guidanceScale, setGuidanceScale] = useState(3.5);
  const [numImages, setNumImages] = useState(1);
  const [enableSafetyChecker, setEnableSafetyChecker] = useState(true);
  const [strength, setStrength] = useState(1);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [syncMode, setSyncMode] = useState(false);
  const [loraUrls, setLoraUrls] = useState([{ url: "", scale: 1 }]);

  // Model Selection
  const [model, setModel] = useState("fal-ai/flux-lora");

  // Fetch generated images from the outputs directory
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/getGeneratedImages"); // Backend route that lists images
        const data = await res.json();

        // Sort images by the numeric part of the filename (assuming the filename is like `generated-image-<timestamp>.jpeg`)
        const sortedImages = data.images.sort((a, b) => {
          const timeA = parseInt(a.match(/(\d+)\.jpeg$/)[1]);
          const timeB = parseInt(b.match(/(\d+)\.jpeg$/)[1]);
          return timeB - timeA; // Sort in descending order (most recent first)
        });

        setGeneratedImages(sortedImages);

        // Display the most recent image by default
        if (sortedImages.length > 0) {
          setImageUrl(`/outputs/${sortedImages[0]}`);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchImages();
  }, []);

  const generateImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image_size: imageSize,
          num_inference_steps: numInferenceSteps,
          guidance_scale: guidanceScale,
          num_images: numImages,
          enable_safety_checker: enableSafetyChecker,
          strength,
          output_format: outputFormat,
          sync_mode: syncMode,
          model, // Pass the selected model to the backend
          loras: loraUrls
            .filter(lora => lora.url.trim() !== "") // Filter out any LoRAs with empty URLs
            .map(lora => ({ path: lora.url, scale: lora.scale })),
        }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Log the full response from the API

      if (response.ok) {
        if (data.imageUrl) {
          setImageUrl(data.imageUrl); // Display the image from the local /outputs directory
          setGeneratedImages([data.imageUrl.split('/').pop(), ...generatedImages]);
        } else {
          throw new Error("No image URL found in the response.");
        }
      } else {
        setError(`Failed to generate image: ${data.message}`);
      }
    } catch (err) {
      console.error("Error occurred:", err.message);
      setError(`Error: ${err.message}`); // This will show more useful information in case something breaks.
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    setIsModalOpen(true); // Open the modal when the image is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const addLoraField = () => {
    setLoraUrls([...loraUrls, { url: "", scale: 1 }]);
  };

  const removeLoraField = () => {
    if (loraUrls.length > 1) {
      setLoraUrls(loraUrls.slice(0, -1)); // Remove the last element from the array
    }
  };

  const handleLoraChange = (index, value) => {
    const updatedLoraUrls = [...loraUrls];
    updatedLoraUrls[index].url = value;
    setLoraUrls(updatedLoraUrls);
  };

  const handleLoraScaleChange = (index, scale) => {
    const updatedLoraUrls = [...loraUrls];
    updatedLoraUrls[index].scale = scale;
    setLoraUrls(updatedLoraUrls);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-screen p-4 bg-[#C1EEFF]">
      {/* Left Sidebar for form */}
      <div className="col-span-3 bg-gray-100 border-r border-gray-300 overflow-y-auto space-y-6 shadow-lg p-4 h-full">
        <h2 className="text-2xl font-bold text-gray-800">fal.ai Image Generator</h2>
        <form onSubmit={generateImage} className="space-y-4">

          {/* Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-700">
              Enter your prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="mt-2 p-3 w-full h-24 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-300 resize-y overflow-y-auto"
              placeholder="A charismatic speaker is captured mid-speech..."
            />
          </div>

          {/* Submit Prompt */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-black text-white rounded-lg shadow-md hover:bg-gray-700"
          >
            Try this prompt →
          </button>

          {/* Model Selection */}
          <div>
            <label htmlFor="model" className="block text-lg font-medium text-gray-700">
              Select Model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="fal-ai/flux-lora">flux-lora</option>
              <option value="fal-ai/flux/dev">flux/dev</option>
              <option value="fal-ai/flux-realism">flux-realism</option>
            </select>
          </div>

          {/* Image Size */}
          <div>
            <label htmlFor="imageSize" className="block text-lg font-medium text-gray-700">
              Image Size
            </label>
            <select
              id="imageSize"
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="square_hd">Square HD</option>
              <option value="portrait_4_3">Portrait (3:4)</option>
              <option value="portrait_16_9">Portrait (9:16)</option>
              <option value="landscape_4_3">Landscape (4:3)</option>
              <option value="landscape_16_9">Landscape (16:9)</option>
            </select>
          </div>

          {/* LoRA URL Input */}
          <div>
            <label htmlFor="loraUrl" className="block text-lg font-medium text-gray-700">
              LoRA URLs
            </label>
            {loraUrls.map((lora, index) => (
              <div key={index} className="mt-2">
                <input
                  type="text"
                  value={lora.url}
                  onChange={(e) => handleLoraChange(index, e.target.value)}
                  className="p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-300"
                  placeholder="Enter LoRA URL"
                />
                <input
                  type="number"
                  value={lora.scale}
                  onChange={(e) => handleLoraScaleChange(index, e.target.value)}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                  placeholder="Enter Scale (0.0 - 1.0)"
                />
              </div>
            ))}

            {/* Buttons to add/remove LoRA fields */}
            <div className="mt-2">
              <button
                type="button"
                onClick={addLoraField}
                className="py-3 px-6 bg-black text-white rounded-lg shadow-md hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faPlus} /> {/* Add icon */}
              </button>

              {loraUrls.length > 1 && (
                <button
                  type="button"
                  onClick={removeLoraField}
                  className="py-3 px-6 bg-black text-white rounded-lg shadow-md hover:bg-gray-700 ml-2"
                >
                  <FontAwesomeIcon icon={faMinus} /> {/* Remove icon */}
                </button>
              )}
            </div>

          </div>

          {/* Number of Inference Steps */}
          <div>
            <label htmlFor="numInferenceSteps" className="block text-lg font-medium text-gray-700">
              Number of Inference Steps
            </label>
            <input
              type="number"
              id="numInferenceSteps"
              value={numInferenceSteps}
              onChange={(e) => setNumInferenceSteps(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
              min="1"
            />
          </div>

          {/* Guidance Scale */}
          <div>
            <label htmlFor="guidanceScale" className="block text-lg font-medium text-gray-700">
              Guidance Scale
            </label>
            <input
              type="number"
              step="0.1"
              id="guidanceScale"
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          {/* Number of Images */}
          <div>
            <label htmlFor="numImages" className="block text-lg font-medium text-gray-700">
              Number of Images
            </label>
            <input
              type="number"
              id="numImages"
              value={numImages}
              onChange={(e) => setNumImages(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
              min="1"
            />
          </div>

          {/* Enable Safety Checker */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableSafetyChecker"
              checked={enableSafetyChecker}
              onChange={(e) => setEnableSafetyChecker(e.target.checked)}
              className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-300"
            />
            <label htmlFor="enableSafetyChecker" className="ml-2 text-lg font-medium text-gray-700">
              NSFW Disabled
            </label>
          </div>

          {/* Strength */}
          <div>
            <label htmlFor="strength" className="block text-lg font-medium text-gray-700">
              Strength
            </label>
            <input
              type="number"
              step="0.1"
              id="strength"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          {/* Output Format */}
          <div>
            <label htmlFor="outputFormat" className="block text-lg font-medium text-gray-700">
              Output Format
            </label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>

          {/* Sync Mode */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="syncMode"
              checked={syncMode}
              onChange={(e) => setSyncMode(e.target.checked)}
              className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-300"
            />
            <label htmlFor="syncMode" className="ml-2 text-lg font-medium text-gray-700">
              Sync Mode
            </label>
          </div>

        </form>

        {loading && <p className="text-lg text-gray-700">Generating image...</p>}
        {error && <p className="text-lg text-red-600">{error}</p>}
      </div>

      {/* Center Panel for displaying the generated image */}
      <div className="col-span-7 flex items-center justify-center p-4 bg-white shadow-lg">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Image loading...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Generated AI Image"
              className="max-w-full max-h-screen object-contain border border-gray-300 rounded-lg shadow-lg cursor-pointer"
              onClick={handleImageClick} // Trigger the modal when the image is clicked
            />
          </div>
        ) : (
          <p className="text-gray-600">No image generated yet</p>
        )}

        {/* Modal for full-size image */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={handleCloseModal} // Close the modal when clicking outside the image
          >
            <div
              className="relative w-auto max-w-full p-4 bg-white rounded-lg shadow-lg overflow-auto"
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the modal
              style={{ maxHeight: '95vh' }} // Ensure the modal takes up most of the viewport but allows scrolling
            >
              {/* X button to close the modal */}
              <button
                className="absolute top-4 right-4 text-gray-700 text-3xl font-bold hover:text-gray-900"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              {/* Full-size image with max constraints inside the modal */}
              <div className="flex justify-center items-center">
                <img
                  src={imageUrl}
                  alt="Full-size Generated AI Image"
                  className="w-auto h-auto"
                  style={{ maxWidth: '100%', maxHeight: 'none' }} // Prevent scaling the image down
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar for generated image history */}
      <div className="col-span-2 bg-gray-100 border-l border-gray-300 overflow-auto shadow-lg p-4">
        <h2 className="text-lg font-semibold text-gray-700">Image History</h2>
        <ul className="space-y-2">
          {generatedImages.map((image, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
              onClick={() => setImageUrl(`/outputs/${image}`)} // Ensure the image path is correct
            >
              <img
                src={`/outputs/${image}`}
                alt={`Generated Image ${index + 1}`}
                className="w-full h-auto border border-gray-300 rounded-lg"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
