/**
 * All service and DAO layer instances
 * are created here
 */

import {DutyService, DutyServiceImpl } from './DutyService';
import { DutyDaoImpl } from '../dao/DutyDao';
import { Database } from '../db';
import {DB_HOST, DB_PORT, DB_PASSWORD, DB_USERNAME} from '../config';

// Default settings
export const db = new Database({
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  user: DB_USERNAME
});

const dutyDao = new DutyDaoImpl(db);

export const dutyService : DutyService = new DutyServiceImpl(dutyDao);
