import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "センパイリンク",
    short_name: "SENPAIRINK",
    description: "志望校・境遇が似た先輩の体験記を読んで、実際に話せる受験サポート",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    orientation: "portrait",
    categories: ["education"],
    icons: [
      {
        src: "/senpairink-icon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/senpairink-icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
