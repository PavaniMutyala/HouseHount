import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import apiRouter from "./src/server/routes.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Basic Middlewares
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // API router mounting
  app.use("/api", apiRouter);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Serve static files / Vite middleware
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

  if (!isProduction) {
    try {
      console.log("Running in Development mode. Initializing Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (viteError) {
      console.warn("Vite development server initialization failed. Falling back to serving static production assets...", viteError.message);
      serveStaticAssets();
    }
  } else {
    serveStaticAssets();
  }

  function serveStaticAssets() {
    console.log(
      "Running in Production mode. Serving pre-compiled static assets...",
    );
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred on the server.",
      error: process.env.NODE_ENV !== "production" ? err.stack : {},
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `HouseHunt Fullstack server is running on http://0.0.0.0:${PORT}`,
    );
  });
}

startServer().catch((error) => {
  console.error(
    "Fatal error starting the fullstack Express-Vite server:",
    error,
  );
});
