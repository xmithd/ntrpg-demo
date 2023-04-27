import {v4 as uuidv4} from 'uuid';

export interface Duty {
  id: string;
  name: string;
}

/**
 * Helper function to create a duty object
 * @returns Duty
 */
export function createDuty(name?: string): Duty {
  return {
    id: uuidv4(),
    name: name || 'generic task'
  }
}

/**
 * Checks whether this object is a Duty object
 * @param obj The object to validate
 * @returns boolean true if it is, false otherwise
 */
export function validateDuty(obj?: Partial<Duty>): boolean {
  if (!obj || !obj.id || !obj.name)
    return false;
  if (obj.id.length > 255 || obj.name.length > 255)
    return false;

  return true;
}

export const BASE_DUTIES_ROUTE = '/api/v1/duties';
