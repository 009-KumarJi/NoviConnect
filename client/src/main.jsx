import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {CssBaseline} from '@mui/material';
import {HelmetProvider} from "react-helmet-async";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev/index.js";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <CssBaseline/>
      <DevSupport ComponentPreviews={ComponentPreviews}
                  useInitialHook={useInitial}
      >
        <div onContextMenu={(e) => e.preventDefault()}>
          <App/>
        </div>
      </DevSupport>
    </HelmetProvider>
  </React.StrictMode>,
);
