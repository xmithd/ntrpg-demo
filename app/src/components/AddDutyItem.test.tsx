/**
 * @jest-environment jsdom
 */
import {render, fireEvent, screen, cleanup} from '@testing-library/react'
import { act } from 'react-dom/test-utils';
import "@testing-library/jest-dom";

import AddDutyItem from './AddDutyItem';

const add = jest.fn();

beforeEach(() => {
  add.mockReset()
})
afterEach(cleanup);

test('Loads and displays Add button', async () => {
  render(<AddDutyItem
    loading={false}
    onAdd={add}
  />);

  fireEvent.click(screen.getByText('Add'));

  await screen.findByRole('input');

  expect(screen.getByText('Save')).toBeDefined();
});

test('Add is disabled when loading the screen', async () => {
  render(<AddDutyItem
    loading={true}
    onAdd={add}
  />);

  expect(screen.getByRole('button')).toBeDisabled();
});

test('Save is not called when trying to save empty value', async () => {
  render(<AddDutyItem
    loading={false}
    onAdd={add}
  />);

  fireEvent.click(screen.getByText('Add'));

  await screen.findByRole('input');

  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });

  expect(add).not.toBeCalled();
});

test('Add is called when trying to save with a value', async () => {
  render(<AddDutyItem
    loading={false}
    onAdd={add}
  />);

  fireEvent.click(screen.getByText('Add'));

  const el = await screen.findByRole('input');

  await act(async () => {
    fireEvent.change(el, {target: {value: 'some task'}})
    fireEvent.click(screen.getByText('Save'));
  });

  expect(add).toBeCalledWith('some task');
});
