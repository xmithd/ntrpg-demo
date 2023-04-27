import { Bindings, Connection, Database, TxCallback } from '../db';

/**
 * Interface implemented by all DAO (Data Access Object) classes
 * to support transactions.
 */
export interface CommonDao {
  beginTx<T>(cb: TxCallback<T>): Promise<T>;
}

/**
 * Parent class for DAO objects to access a Database
 */
export abstract class AbstractDao implements CommonDao {
  protected connection;
  constructor(db: Database) {
    this.connection = db.getConnection();
  }

  public beginTx<T>(cb: TxCallback<T>): Promise<T> {
    return this.connection.tx(cb);
  }
}

// The classes below are only used for testing
// Perhaps, they could be moved elsewhere
class MockConnection implements Connection {
  query<T>(query: string, bindings?: Bindings | undefined): Promise<T[]> {
    console.log(query, bindings);
    return Promise.resolve([]);
  }
}

export abstract class DaoForTest implements CommonDao {
  public beginTx<T>(cb: TxCallback<T>): Promise<T> {
    return cb(new MockConnection());
  }
}
