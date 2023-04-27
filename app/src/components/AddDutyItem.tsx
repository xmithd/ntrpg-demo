import {useState} from 'react';
import {Button, Input, List} from 'antd';

interface AddDutyProps {
  onAdd: (name: string) => Promise<boolean>;
  loading: boolean;
}

const AddDutyItem: React.FC<AddDutyProps> = ({onAdd, loading}) => {
  const [editMode, setEditMode] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [val, setVal] = useState('');

  async function saveNew(): Promise<void> {
    if (val.length === 0) {
      setValidationError('Name cannot be empty');
      return;
    }
    setValidationError('');
    setAddLoading(true);
    const done = await onAdd(val);
    setAddLoading(false);
    if (done) {
      setVal('');
      setEditMode(false);
    }
  }

  return <List.Item
    actions={editMode ? [
      <Button disabled={addLoading} onClick={() => setEditMode(false)}>Cancel</Button>,
      <Button disabled={addLoading || loading} onClick={saveNew} type="primary" loading={addLoading}>Save</Button>,
    ] : []}
  >
    {editMode ? <Input
    placeholder={validationError}
    role="input"
    status={validationError.length > 0 ? 'error' : ''}
    type='text'
    value={val}
    onChange={ (evt) => {
      const newVal = evt.target.value;
      setVal(newVal);
    }}
    onPressEnter={saveNew}
    onKeyUp={(evt) => {
      if (evt.key === 'Escape') {
        setEditMode(false);
      }
    }}
    />: <Button disabled={loading} onClick={() => setEditMode(true)}>Add</Button>
    }
  </List.Item>;

}

export default AddDutyItem;
