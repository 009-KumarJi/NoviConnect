import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {createTheme, CssBaseline, responsiveFontSizes, ThemeProvider} from '@mui/material';
import {HelmetProvider} from "react-helmet-async";
import {Provider} from "react-redux";
import store from "./redux/store";

let theme = responsiveFontSizes(createTheme());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider> 
        <CssBaseline/>
          <div onContextMenu={(e) => e.preventDefault()}>
            <ThemeProvider theme={theme}>
              <App/>
            </ThemeProvider>
          </div>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
