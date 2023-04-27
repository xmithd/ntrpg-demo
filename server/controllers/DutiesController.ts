import {FastifyRequest, FastifyReply} from 'fastify';
import status from 'http-status';

import { BadRequestException } from '../utils/errorHandling';
import { dutyService } from '../services';
import { Duty } from '../../common/duty';

// controller functions for duty objects

export async function getDuties(req: FastifyRequest<{Querystring: {offset?: string, limit?: string}}>, res: FastifyReply): Promise<void> {
  let limit = 0;
  let offset = 0;
  if (typeof req.query.limit === 'string') {
    limit = parseInt(req.query.limit, 10);
  }
  if (typeof req.query.offset === 'string') {
    offset = parseInt(req.query.offset, 10);
  }
  if (isNaN(limit) || isNaN(offset)) {
    throw new BadRequestException();
  }
  const duties = await dutyService.getDuties(offset, limit);
  res.status(status.OK).send(duties);
}

export async function getDuty(req: FastifyRequest<{Params: {id: string}}>, res: FastifyReply): Promise<void> {
  const duty = await dutyService.getDuty(req.params.id);
  res.status(status.OK).send(duty);
}

export async function updateDuty(req: FastifyRequest<{Params: {id: string}}>, res: FastifyReply): Promise<void> {
  let body = req.body as Partial<Duty>;
  const obj: Partial<Duty> = {
    id: req.params.id,
    name: body.name,
  };
  const duty = await dutyService.updateDuty(obj);
  res.status(status.OK).send(duty);
}

export async function createDuty(req: FastifyRequest, res: FastifyReply): Promise<void> {
  let body = req.body as Partial<Duty>;
  const obj: Partial<Duty> = {
    id: body.id,
    name: body.name,
  };
  const duty = await dutyService.createDuty(obj);
  res.status(status.CREATED).send(duty);
}

export async function deleteDuty(req: FastifyRequest<{Params: {id: string}}>, res: FastifyReply) {
  await dutyService.deleteDuty(req.params.id);
  res.status(status.NO_CONTENT).send();
}
