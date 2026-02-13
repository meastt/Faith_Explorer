import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import App from './App.tsx'

// Ensure DOM is ready and add error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Mounting React app...');
try {
  const root = createRoot(rootElement);
  
  // Add a simple test div first to verify rendering works
  rootElement.style.backgroundColor = '#fdfcfb';
  rootElement.style.minHeight = '100vh';
  rootElement.style.width = '100%';
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('React app mounted successfully');
  
  // Log after a short delay to see if components render
  setTimeout(() => {
    console.log('App render check - root element:', rootElement);
    console.log('App render check - has children:', rootElement.children.length);
  }, 1000);
} catch (error) {
  console.error('Failed to mount React app:', error);
  // Show error on screen as fallback
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red; font-family: sans-serif; background: white;">
      <h1>Error Loading App</h1>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>
  `;
}
