import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep your existing global CSS
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BlogProvider } from './contexts/BlogContext'; // Assuming BlogProvider is here or App.js
import { BrowserRouter as Router } from 'react-router-dom'; // Assuming Router is here or in App.js

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a default theme instance
const theme = createTheme({
  // You can customize the theme here later if needed.
  // For example:
  // palette: {
  //   primary: {
  //     main: '#1976d2',
  //   },
  //   secondary: {
  //     main: '#dc004e',
  //   },
  // },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router> {/* Ensure Router wraps App if not already done in App.js */}
        <BlogProvider> {/* Ensure BlogProvider wraps App if not already done in App.js */}
          <App />
        </BlogProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
