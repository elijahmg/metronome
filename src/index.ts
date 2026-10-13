import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/click.wav": () => new Response(Bun.file("public/click.wav")),
    "/click-accent.wav": () =>
      new Response(Bun.file("public/click-accent.wav")),
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
