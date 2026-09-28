import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { EducationProvider } from './context/EducationContext';
import { StudyProvider } from './context/StudyContext';
import { OfflineProvider } from './context/OfflineContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { pwaService } from './services/pwaService';
import './index.css';

// Initialize PWA Service Worker and Install listeners
pwaService.init();

// Dismiss fallback splash screen smoothly on mount
const dismissSplash = () => {
  const splash = document.getElementById('app-splash');
  if (splash) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.remove();
    }, 400);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <EducationProvider>
            <StudyProvider>
              <OfflineProvider>
                <App />
              </OfflineProvider>
            </StudyProvider>
          </EducationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Trigger splash dismiss
requestAnimationFrame(() => {
  setTimeout(dismissSplash, 150);
});
