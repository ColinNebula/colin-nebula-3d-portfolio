import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome to nebula 3d/i);
  expect(headingElement).toBeInTheDocument();
});
