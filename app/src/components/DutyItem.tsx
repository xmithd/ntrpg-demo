import { useState } from 'react';
import {Button, Input, List, Popconfirm } from 'antd';

import { Duty } from '../../../common/duty';

interface DutyItemProps {
  duty: Duty;
  onRemoveDuty: (id: string) => Promise<void>;
  onUpdateDuty: (item: Duty) => Promise<boolean>;
}

/**
 * List Entry for a Duty object. Can be edited.
 * @param DutyItemProps props
 * @returns a React component
 */
export const DutyItem: React.FC<DutyItemProps> = ({duty, onRemoveDuty, onUpdateDuty}) => {

  const [editMode, setEditMode] = useState(false);
  const [dirtyValue, setDirtyValue] = useState(duty.name);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const save = async () => {
    if (dirtyValue.length == 0) {
      setValidationError('Name cannot be empty');
      return;
    }
    setValidationError('');
    setUpdateLoading(true);
    const done = await onUpdateDuty({id: duty.id, name: dirtyValue});
    setUpdateLoading(false);
    if (done) {
      setEditMode(false);
    }
  };

  return (
    <List.Item
    actions={[
      <Button
      onClick={() => setEditMode(!editMode)}
      disabled={updateLoading}
      >
        {editMode ? 'Cancel' : 'Edit'}
      </Button>,
      <>
      {editMode ? <Button onClick={save} type="primary" disabled={updateLoading} loading={updateLoading}>Save</Button> :
      <Popconfirm
        title="Are you sure you want to delete?"
        onConfirm={async () => {
          setDeleteLoading(true);
          await onRemoveDuty(duty.id);
          setDeleteLoading(false);
        }}
      >
        <Button disabled={deleteLoading} loading={deleteLoading} type="primary" danger>
          X
        </Button>
      </Popconfirm>}</>,
    ]}
    >
    {editMode ?
    <Input
    role="input"
    status={dirtyValue.length === 0 ? 'error' :''}
    type='text'
    value={dirtyValue}
    onChange={(evt) => {
      const val = evt.target.value;
      if (validationError.length > 0 && val.length > 0) {
        setValidationError('');
      }
      setDirtyValue(evt.target.value);
    }}
    placeholder={validationError}
    onPressEnter={save}
    onKeyUp={(evt) => {
      if (evt.key === 'Escape') {
        setEditMode(false);
      }
    }}
    /> :
    <div className="item-list-text">{duty.name}</div>}
  </List.Item>
  );
};
