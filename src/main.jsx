import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Handle GitHub Pages 404 redirect
// The 404.html redirects to /?/path, we need to convert it back to /path
(function handle404Redirect() {
  const l = window.location;
  const basePath = "/edulink360-frontend";
  
  // Check if we're in a redirect from 404.html (has ?/ in the path)
  if (l.search[1] === "/") {
    const path = l.search.slice(1).replace(/\?&?$/, "").replace(/~and~/g, "&");
    const newPath = basePath + "/" + path.replace(/^\/+/, "") + l.hash;
    window.history.replaceState({}, "", newPath);
  }
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/edulink360-frontend">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
