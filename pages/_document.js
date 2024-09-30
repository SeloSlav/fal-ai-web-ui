// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* General Meta Tags */}
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Generate AI-powered images with fal.ai using LoRA models and advanced image creation tools." />
                <meta name="keywords" content="AI Image Generator, fal.ai, LoRA models, AI art, image creation, AI API" />
                <meta name="author" content="fal.ai Image Generator Team" />

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content="fal.ai Image Generator: Create Stunning AI Images" />
                <meta property="og:description" content="Use fal.ai's advanced AI-powered tools to generate images based on your prompts. Customize using LoRA models for incredible results." />
                <meta property="og:image" content="/path-to-your-og-image.jpg" /> {/* You should add your app's logo or a sample image */}
                <meta property="og:url" content="https://your-website-url.com" />
                <meta property="og:type" content="website" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="fal.ai Image Generator: Create Stunning AI Images" />
                <meta name="twitter:description" content="Generate AI images based on prompts with fal.ai, and explore LoRA models for more refined results." />
                <meta name="twitter:image" content="/path-to-your-twitter-image.jpg" /> {/* Make sure you have an image for social previews */}
                <meta name="twitter:site" content="@fal_ai" /> {/* Use your project's Twitter handle here */}

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />

                {/* Add custom fonts or styles if needed */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
