import localFont from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "fal.ai Image Generator",
  description: "Generate AI Images with a beautiful interface",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 font-serif">
        {/* Full screen container to allow the layout to stretch */}
        <div>
          {/* Children components now take full width and height */}
          {children}
        </div>
      </body>
    </html>
  );
}
