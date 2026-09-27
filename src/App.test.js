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

const click = (label) => {
  const button = [...container.querySelectorAll('button')].find((item) => item.textContent.includes(label));
  expect(button).toBeTruthy();
  act(() => button.dispatchEvent(new MouseEvent('click', { bubbles: true })));
};

const enter = (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  act(() => { setter.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); });
};

test('starts in the transparent local-workspace welcome flow', () => {
  act(() => root.render(<App />));
  expect(container.textContent).toContain('StudentOS');
  expect(container.textContent).toContain('Create account');
  expect(container.textContent).toContain('education details only when they are useful');
});

test('primary flow asks only the relevant country, system, level, and grade before dashboard', () => {
  window.scrollTo = jest.fn();
  act(() => root.render(<App />));
  click('Create account');
  enter(container.querySelector('input[placeholder*="greet"]'), 'Lina');
  click('Continue');
  click('Algeria');
  click('Algerian national education');
  click('Primary School');
  expect(container.textContent).toContain('What grade or year are you in?');
  expect(container.textContent).not.toContain('track or stream');
  enter(container.querySelector('.large-answer input'), 'Grade 5');
  click('Continue');
  expect(container.textContent).toContain('Welcome to your StudentOS');
  click('Open StudentOS');
  expect(container.textContent).toContain('Good');
  expect(container.textContent).toContain('Lina');
});
