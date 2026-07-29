import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(__dirname, {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

app.get("*", (req, res, next) => {
  if (req.accepts("html")) {
    let filePath = path.join(__dirname, req.path);
    if (!req.path.endsWith(".html") && req.path !== "/") {
      filePath += ".html";
    }
    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, "index.html"));
      }
    });
  } else {
    next();
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
