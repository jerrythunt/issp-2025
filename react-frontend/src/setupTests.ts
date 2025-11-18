
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: () => {},
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: () => Promise.resolve(),
});
