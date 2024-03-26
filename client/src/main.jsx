import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {CssBaseLine} from '@material-ui';
import {HelmetProvider} from "react-helmet-async";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <CssBaseLine />
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
