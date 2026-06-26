import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';

try {
  const html = renderToString(React.createElement(App));
  console.log("Render successful, HTML length:", html.length);
} catch (error) {
  console.error("Render failed:");
  console.error(error);
}
