import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Frame } from "./screens/Frame";
import Admin from "./screens/Admin";
import EpisodePreview from "./screens/EpisodePreview";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminPreview from "./screens/AdminPreview/AdminPreview";


createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Frame />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/episode/:id" element={<EpisodePreview />} />
          <Route path="/admin/preview" element={<AdminPreview />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
