import {Duty} from '../../common/duty';
import { Connection, Database } from '../db';
import { AbstractDao, CommonDao, DaoForTest } from './AbstractDao';

/**
 * Duty Data access object interface
 */
export interface DutyDao extends CommonDao {

  /**
   * Gets a list of Duty objects
   * @param offset the number of rows to skip
   * @param limit maximum number of rows to return
   * @param cx optional Connection object
   */
  getDuties(offset: number, limit: number, cx?: Connection): Promise<Duty[]>;

  /**
   * Gets a duty object by id. Returns null if not found.
   * @param id The id of the duty object
   * @param cx optional Connection object
   */
  getDuty(id: string, cx?: Connection): Promise<Duty|null>;

  /**
   * Inserts a duty object in the database
   * @param duty The duty object to insert
   * @param cx optional Connection object
   */
  insertDuty(duty: Duty, cx?: Connection): Promise<void>;

  /**
   * Updates the given duty object
   * @param duty duty object
   * @param cx optional Connection object
   */
  updateDuty(duty: Duty, cx?: Connection): Promise<void>;

  /**
   * Deletes the duty object by id
   * @param duty duty object
   * @param cx optional Connection object
   */
  deleteDuty(id: string, cx?: Connection): Promise<void>;

}

/**
 * Default implementation of Duty Data Access Object
 */
export class DutyDaoImpl extends AbstractDao implements DutyDao {

  constructor(db: Database) {
    super(db);
  }

  async getDuty(id: string, cx = this.connection): Promise<Duty|null> {
    const res = await cx.query<Duty>('SELECT id, name from duty where id = $1', [id]);
    if (res.length > 0) {
      return res[0];
    } else {
      // not found
      return null;
    }
  }

  async getDuties(offset: number, limit: number, cx = this.connection): Promise<Duty[]> {
    let queryBuilder = ['SELECT id, name from duty ORDER BY created_at'];
    let bindings = [];
    let counter = 1;
    if (limit > 0) {
      bindings.push(limit);
      queryBuilder.push(`LIMIT \$${counter}`);
      counter++;
    }
    if (offset > 0) {
      bindings.push(offset);
      queryBuilder.push(`OFFSET \$${counter}`);
      counter++;
    }
    const res = await cx.query<Duty>(queryBuilder.join(' '), bindings);
    return res;
  }

  async insertDuty(duty: Duty, cx = this.connection): Promise<void> {
    await cx.query<unknown>('INSERT INTO duty VALUES ($1, $2)', [duty.id, duty.name]);
  }

  async updateDuty(duty: Duty, cx = this.connection): Promise<void> {
    await cx.query<unknown>('UPDATE duty set name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [duty.name, duty.id]);
  }

  async deleteDuty(id: string, cx = this.connection): Promise<void> {
    await cx.query<unknown>('DELETE FROM duty WHERE id = $1', [id]);
  }

}

/**
 * Test implementation for the Duty data access object
 */
export class DutyDaoForTest extends DaoForTest implements DutyDao {

  // public in memory storage for unit tests
  public store: Duty[] = [];

  getDuties(offset: number, limit: number, cx?: Connection): Promise<Duty[]> {
    // return everything for now
    return Promise.resolve(this.store);
  }
  getDuty(id: string, cx?: Connection | undefined): Promise<Duty | null> {
    const item = this.store.find( el => el.id === id);
    return Promise.resolve(item ?? null);
  }

  insertDuty(duty: Duty, cx?: Connection): Promise<void> {
    this.store = [...this.store, duty];
    return Promise.resolve();
  }

  updateDuty(duty: Duty, cx?: Connection): Promise<void> {
    const item = this.store.find( el => el.id === duty.id);
    if (item !== undefined)
      item.name = duty.name;
    return Promise.resolve();
  }

  deleteDuty(id: string, cx?: Connection): Promise<void> {
    this.store = this.store.filter(el => el.id !== id);
    return Promise.resolve();
  }
}
