import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ServiceHub",
    short_name: "ServiceHub",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFBF5",
    theme_color: "#FF8811",
    description:
      "Find trusted local experts for your home, or grow your business with ServiceHub.",
    icons: [
      { src: "/icons/Icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/Icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/Icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/Icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
