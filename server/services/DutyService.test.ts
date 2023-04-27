import { DutyDaoForTest } from '../dao/DutyDao';
import { DutyServiceImpl } from './DutyService';
import { BadRequestException } from '../utils/errorHandling';

const dao = new DutyDaoForTest();
const service = new DutyServiceImpl(dao);

describe('The service', () => {
  beforeEach(() => {
    // add some data
    dao.store = [{id: '1', name: 'write unit tests'}, {id: '2', name: 'write documentation'}];
  })
  it('can return empty list', async () => {
    const res = await service.getDuties(0, 0);
    expect(res).toEqual(dao.store.slice());
  });

  it('can return items', async () => {
    const res = await service.getDuties(0, 0);
    expect(res.length).toBe(2);
  });

  it('can return item by id', async () => {
    const res = await service.getDuty('2');
    expect(res).toBe(dao.store[1]);
  });

  it('throws when id is longer than 255 characters', async () => {
    const len = 256;
    const id = Array(len).fill(0).map(() => 'a').join('');
    expect(id.length).toBe(len);
    await expect(service.getDuty(id)).rejects.toThrow(BadRequestException);
  });

  it('can insert a new item', async () => {
    await service.createDuty({name: 'new task'});
    expect(dao.store.length).toBe(3);
  });

  it('can update an existing item', async () => {
    await service.updateDuty({id: '1', name: 'booo'});
    expect(dao.store.length).toBe(2);
    expect(dao.store[0].id).toBe('1');
    expect(dao.store[0].name).toBe('booo');
  });

  it('can delete an item', async () => {
    await service.deleteDuty('2');
    expect(dao.store.length).toBe(1);
    expect(dao.store[0].id).toBe('1');
  });

})
