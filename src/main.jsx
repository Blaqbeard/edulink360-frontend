import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- Add it here
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* This is the single, top-level router for your entire app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
