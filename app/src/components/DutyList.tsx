import { List, Spin } from 'antd';
import { Duty } from '../../../common/duty';
import { DutyItem } from './DutyItem';
import AddDutyItem from './AddDutyItem';

interface DutyListProps {
  duties: Duty[];
  loading: boolean;
  onDutyRemoval: (id: string) => Promise<void>;
  onDutyUpdate: (duty: Duty) => Promise<boolean>;
  onDutyAdd: (name: string) => Promise<boolean>;
}

/**
 * Renders a list of DutyListItem. In the footer, there is a AddDutyItem
 * component to add a new duty.
 * @param DutyListProps
 * @returns a React component
 */
const DutyList: React.FC<DutyListProps> = ({
  duties,
  loading,
  onDutyRemoval,
  onDutyUpdate,
  onDutyAdd
}) => (
  <List
    locale={{
      emptyText: 'There are no duties!',
    }}
    header={<div>List of Duties {loading && <Spin />}</div>}
    footer={<AddDutyItem onAdd={onDutyAdd} loading={loading}/>}
    bordered
    dataSource={duties}
    renderItem={(duty) => (
      <DutyItem
        duty={duty}
        onRemoveDuty={onDutyRemoval}
        onUpdateDuty={onDutyUpdate}
      />
    )}
  />
);

export default DutyList;
