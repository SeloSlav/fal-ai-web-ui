// pages/api/generateImage.js

import * as fal from "@fal-ai/serverless-client";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Fetching the image from the result

const FAL_KEY = process.env.FAL_KEY;

fal.config({
    credentials: FAL_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const {
        prompt,
        image_size,
        num_inference_steps,
        guidance_scale,
        num_images,
        enable_safety_checker,
        strength,
        output_format,
        sync_mode,
        model,
        loras = [] // Default to an empty array if not provided
    } = req.body;

    try {
        const result = await fal.subscribe(model, {
            input: {
                prompt,
                image_size,
                num_inference_steps,
                guidance_scale,
                num_images,
                enable_safety_checker,
                strength,
                output_format,
                loras: loras.length > 0 ? loras : undefined, // Only include loras if it's not empty
            },
            sync_mode,
        });

        const imageUrl = result.images[0].url;
        const imageResponse = await fetch(imageUrl); // Fetch the image from the result URL
        const buffer = await imageResponse.buffer(); // Convert to a buffer

        const outputDir = path.join(process.cwd(), 'public', 'outputs'); // Save in the public/outputs directory
        const imageName = `generated-image-${Date.now()}.jpeg`;
        const outputFilePath = path.join(outputDir, imageName);

        // Ensure the outputs folder exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Save the image buffer to a file in the outputs folder
        fs.writeFileSync(outputFilePath, buffer);

        // Return a relative URL that the frontend can access
        res.status(200).json({ message: 'Image generated and saved!', imageUrl: `/outputs/${imageName}` });
    } catch (error) {
        console.error("Error generating image:", error.message);
        res.status(500).json({ message: "Failed to generate image", error: error.message });
    }
}