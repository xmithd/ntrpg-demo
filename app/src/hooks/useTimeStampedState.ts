import { useState } from 'react';

export type TimeStampedState<T> = {
  timestamp: number,
  data: T,
};

/**
 * Custom hook wrapping useState to get the timestamp when
 * the data was set.
 * @param initialState
 * @returns
 */
export default function useTimeStampedState<V>(initialState: V): [TimeStampedState<V>, (data:V)=>void] {
  const [state, setState] = useState<TimeStampedState<V>>({
    timestamp: Date.now(),
    data: initialState
  });

  const setNewState = (data: V): void => {
    setState({
      timestamp: Date.now(),
      data
    });
  }

  return [state, setNewState];
}
