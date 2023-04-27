/**
 * @jest-environment jsdom
 */
import {render, fireEvent, screen, cleanup} from '@testing-library/react'
import { act } from 'react-dom/test-utils';

import { DutyItem } from './DutyItem';
import { createDuty } from '../../../common/duty';

const remove = jest.fn();
const update = jest.fn();

beforeEach(() => {
  remove.mockReset()
  update.mockReset();
})
afterEach(cleanup);

test('loads and displays duty item', async () => {
  const duty = createDuty();
  render(<DutyItem
    duty={duty}
    onRemoveDuty={remove}
    onUpdateDuty={update}
  />);

  fireEvent.click(screen.getByText('Edit'));

  await screen.findByRole('input');

  expect(screen.getByText('Save')).toBeDefined();
});

test('calls update on save', async () => {
  const duty = createDuty();
  render(<DutyItem
    duty={duty}
    onRemoveDuty={remove}
    onUpdateDuty={update}
  />);

  await act(async () => {
    fireEvent.click(screen.getByText('Edit'));
  });
  await screen.findByRole('input');

  await act( async () => {
    fireEvent.click(screen.getByText('Save'));
  });
  expect(update).toBeCalledWith(duty);
});

test('makes some basic validation when name is empty', async () => {
  const duty = createDuty();
  duty.name = '';
  render(<DutyItem
    duty={duty}
    onRemoveDuty={remove}
    onUpdateDuty={update}
  />);

  act(() => {
    fireEvent.click(screen.getByText('Edit'));
  });
  await screen.findByRole('input');

  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });
  expect(update).not.toBeCalled();
});

test('calls remove function on delete', async () => {
  const duty = createDuty();
  render(<DutyItem
    duty={duty}
    onRemoveDuty={remove}
    onUpdateDuty={update}
  />);

  act(() => {
    fireEvent.click(screen.getByText('X'));
  });
  await screen.findByRole('tooltip');

  await act(async () => {
    fireEvent.click(screen.getByText('OK'));
  });
  expect(remove).toBeCalledWith(duty.id);
});
