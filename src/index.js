// import React from 'react';
import ReactDOM from "react-dom";
import "simplebar/src/simplebar.css";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
<script defer data-domain="lucent-phoenix-eea33f.netlify.app/login" src="https://plausible.io/js/script.js"></script>
ReactDOM.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
  document.getElementById("root")
);
