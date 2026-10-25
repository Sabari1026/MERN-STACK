import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.matchMedia if not available in jsdom
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    })
  });
}

// Suppress unhandled network error logs in JSDOM tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('AggregateError') || args[0].includes('Network Error') || args[0].includes('React Router Future Flag'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
