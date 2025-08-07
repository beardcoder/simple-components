// Test setup file for global configurations
import { beforeEach, afterEach } from 'vitest';

// Clear DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  // Clear localStorage between tests
  localStorage.clear();
});
