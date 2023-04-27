import {useEffect, useState} from 'react';
import { Alert } from 'antd';

import { request } from '../hooks/useFetch';

import DutyList from './DutyList';
import { Duty } from '../../../common/duty';

/**
 * This is a high level component
 * that makes the API calls and manages
 * state for basic CRUD duty items.
 */
export const DutiesComponent: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [duties, setDuties] = useState<Duty[]>([]);

  // initial loading of the duties
  useEffect( () => {
      setLoading(true);
      const [canceller, resP] = request<unknown, Duty[]>('/api/v1/duties', 'GET');
      resP.then( data => {
        setDuties(data);
        setLoading(false);
      }).catch(e => {
        setError(e.message);
        setLoading(false);
      });
      return () => {
        canceller.cancelRequest();
      }
  }, []);


  async function update(item: Duty): Promise<boolean> {
    setLoading(true);
    let done = false;
    try {
      const [_, resP] = request(`/api/v1/duties/${encodeURI(item.id)}`, 'POST', item);
      // let the promise complete
      await resP;
      done = true;
      // then update in list
      setDuties(duties.map(el => {
        if (el.id === item.id) {
          return item;
        }
        return el;
      }));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
    return done;
  }

  async function remove(id: string): Promise<void> {
    setLoading(true);
    try {
      const [_, resP] = request(`/api/v1/duties/${encodeURI(id)}`, 'DELETE');
      // let the promise complete
      await resP;
      // then just remove from list
      setDuties(duties.filter(el => el.id !== id));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function add(name: string): Promise<boolean> {
    setLoading(true);
    let done = false;
    try {
      const [_, resP] = request<Partial<Duty>, Duty>('/api/v1/duties', 'PUT', {name});
      // let the promise complete
      const newDuty = await resP;
      // then add duty on the list
      setDuties([...duties, newDuty]);
      done = true;
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
    return done;
  }

  return <>
    <div style={{marginTop: '10px'}}>
    {error &&
    <Alert
      message={error}
      type="error"
      closable
      onClose={() => setError('')}
    /> }
      <DutyList
        loading={loading}
        duties={duties}
        onDutyRemoval={remove}
        onDutyUpdate={update}
        onDutyAdd={add}
      />
    </div>
  </>;
};
