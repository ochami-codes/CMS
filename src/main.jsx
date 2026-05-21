// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/general/globals.css";
import "./styles/general/variables.css";
import "./styles/general/typography.css";
import "./styles/general/utilities.css";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
