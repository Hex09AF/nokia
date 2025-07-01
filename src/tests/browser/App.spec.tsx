import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import App from '../../App.tsx';
import { userEvent } from '@vitest/browser/context';

test('counter button increments the count', async () => {
  const screen = render(<App />);

  await expect.element(screen.getByText('You can edit page title later on from settings')).toBeInTheDocument();
  await userEvent.keyboard('4488999');
  await expect.element(screen.getByText('huy')).toBeInTheDocument();
});
