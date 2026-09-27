import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

test('starts in the transparent local-workspace welcome flow', () => {
  act(() => root.render(<App />));
  expect(container.textContent).toContain('StudentOS');
  expect(container.textContent).toContain('Create workspace');
  expect(container.textContent).toContain('This preview does not imitate one');
});
