import { ClientBase, Pool } from 'pg';
import {ApiError} from '../utils/errorHandling';
import logger from '../utils/logger';

type BindingType = string | number | null;

export type TxCallback<T> = (c: Connection) => Promise<T>;

export type Bindings = BindingType[];

type DBConfiguration = {
  host: string;
  port: number;
  user: string;
  password: string;
}

class DBError extends ApiError {
  getCode(): number {
    return 500;
  }
  constructor(e: Error) {
    super('Database Error', e);
  }
}

export interface Connection {
  query<T>(query: string, bindings?: Bindings): Promise<T[]>;
}

export interface Transaction {
  tx<T>(cb: TxCallback<T>): Promise<T>;
}

/**
 * Represents a connection that belongs to a transaction.
 * We cannot create an inner transaction from this connection.
 */
class TxConnection implements Connection {
  private client: ClientBase;

  constructor(client: ClientBase) {
    this.client = client;
  }

  async query<T>(query: string, bindings?: Bindings | undefined): Promise<T[]> {
    try {
      const res = await this.client.query(query, bindings);
      logger.info('Ran query ' + query);
      return res.rows as T[];
    } catch (e) {
      logger.error('Failed to run query ' + query, e.stack || e.message);
      throw new DBError(e);
    }
  }
}

/**
 * Wrapper class to store a connection
 * in the DAO layer objects
 */
class ConnectionWrapper implements Connection, Transaction {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }
  async query<T>(query: string, bindings?: Bindings | undefined): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(query, bindings);
      logger.info('Ran query ' + query);
      return res.rows as T[];
    } catch (err) {
      logger.error('Error running query ' + query, err.stack || err.message);
      throw new DBError(err);
    } finally {
      client.release();
    }
  }

  async tx<T>(cb: TxCallback<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const cx = new TxConnection(client);
      const ret = cb(cx);
      client.query('COMMIT');
      return ret;
    } catch (e) {
      logger.error(`Error running transaction ${e.message}`);
      try {
        await client.query('ROLLBACK');
      } catch (rberr) {
        logger.error('Error while rolling back ' + rberr.message);
      }
      throw e;
    } finally {
      client.release();
    }
  }
}

/**
 * Database class that represents the PostgreSQL database
 * This should ideally be an interface and have an implementation for PostgreSQL
 * and other databases as needed.
 */
export class Database {

  private pool: Pool;
  private cxWrapper: ConnectionWrapper;

  constructor(config: Partial<DBConfiguration>) {
    this.pool = new Pool({
      user: config.user ?? '',
      port: config.port ?? 5432,
      host: config.host ?? 'localhost',
      password: config.password ?? '',
    });
    this.cxWrapper = new ConnectionWrapper(this.pool);
  }

  getConnection(): ConnectionWrapper {
    return this.cxWrapper;
  }

  async isConnectionWorking(): Promise<boolean> {
    try {
      await this.pool.query('SELECT NOW()');
      return true;
    } catch (err) {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
    } catch (e) {
      logger.error('Error trying to disconnect db...', e.message);
    }
  }

}

