import { v4 as uuidv4 } from 'uuid';

import {DutyDao} from '../dao/DutyDao';
import {Duty, validateDuty} from '../../common/duty';
import { BadRequestException, NotFoundException } from '../utils/errorHandling';

/**
 * Interface for the Duty service.
 * The service layer is where all the business logic
 * goes.
 */
export interface DutyService {

  /**
   * Gets list of duties
   * @param offset the page number
   * @param limit the number of items in one page
   */
  getDuties(offset: number, limit: number): Promise<Duty[]>;

  /**
   * Gets duty by id
   * @param id id of the duty object
   */
    getDuty(id: string): Promise<Duty>;


  /**
   * Creates a duty with the given name
   * This method will generate the id if not provided
   * @param duty the duty object to create on the database
   */
  createDuty(duty: Partial<Duty>): Promise<Duty>;

  /**
   * Updates the duty object
   * @param duty the object to update
   */
  updateDuty(duty: Partial<Duty>): Promise<Duty>;

  /**
   * Deletes a duty object by id
   * @param id: the id to delete
   */
  deleteDuty(id: string): Promise<void>;
}

export class DutyServiceImpl implements DutyService {
  // data access object
  private dao: DutyDao;

  constructor(dutyDao: DutyDao) {
    this.dao = dutyDao;
  }

  /**
   * Gets list of duties
   * @param offset the page number
   * @param limit the number of items in one page
   */
  getDuties(offset: number, limit: number): Promise<Duty[]> {
    return this.dao.getDuties(offset, limit);
  }

  /**
   * Gets duty by id
   * @param id id of the duty object
   */
  async getDuty(id: string): Promise<Duty> {
    if (id.length > 255) {
      throw new BadRequestException('Length of id is too long');
    }
    const duty = await this.dao.getDuty(id);
    if (duty === null) {
      throw new NotFoundException(`Duty with id ${id} not found.`);
    }
    return duty;
  }

  /**
   * Creates a duty with the given name
   * This method will generate the id if not provided
   * @param duty the duty object to create on the database
   */
  async createDuty(duty: Partial<Duty>): Promise<Duty> {
    if (duty.name === undefined || duty.name?.length === 0) {
      throw new BadRequestException('Name is mandatory');
    }
    let id = duty.id ?? uuidv4();
    const toInsert = {id, name: duty.name};
    if (!validateDuty(toInsert)) {
      throw new BadRequestException('Duty object is not valid!');
    }
    await this.dao.insertDuty(toInsert);
    return toInsert;
  }

  /**
   * Updates the duty object
   * @param duty the object to update
   */
  async updateDuty(duty: Partial<Duty>): Promise<Duty> {
    if (duty.id === undefined || duty.id.length === 0) {
      throw new BadRequestException('id is required');
    }
    if (duty.name === undefined || duty.name.length === 0) {
      throw new BadRequestException('name is required');
    }
    const toUpdate = {id: duty.id, name: duty.name};
    if (!validateDuty(toUpdate)) {
      throw new BadRequestException('Duty object is not valid!');
    }
    await this.dao.updateDuty(toUpdate);
    return toUpdate;
  }

  /**
   * Deletes a duty object by id
   * @param id: the id to delete
   */
  async deleteDuty(id: string): Promise<void> {
    if (id.length > 255) {
      throw new BadRequestException('Length of id is too long');
    }
    await this.dao.beginTx(async (connection) => {
      const existing = await this.dao.getDuty(id, connection);
      if (!existing) {
        throw new NotFoundException(`Missing duty with id ${id}`);
      }
      await this.dao.deleteDuty(id, connection);
    });
  }
}
