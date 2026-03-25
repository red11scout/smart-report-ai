import { app, httpServer, initApp, log } from "./app";
import { serveStatic } from "./static";

(async () => {
  await initApp();

  // In production, serve static files; in dev, use Vite middleware
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
