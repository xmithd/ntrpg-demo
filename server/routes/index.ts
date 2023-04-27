import { FastifyInstance } from 'fastify';

import { createDuty,
  deleteDuty,
  getDuties,
  getDuty,
  updateDuty
} from '../controllers/DutiesController';
import { BASE_DUTIES_ROUTE } from '../../common/duty';

type RouteOptions = {
}

// function to register our v1 API routes
export function apiRoutes(fastify: FastifyInstance , _options: RouteOptions, done: () => void) {

  // test route
  fastify.get('/api/v1/time', (_request, _reply) => {
    const now = new Date();
    return {
      currentDate: now
    };
  });

  fastify.get(BASE_DUTIES_ROUTE, getDuties);

  fastify.get(`${BASE_DUTIES_ROUTE}/:id`, getDuty);

  fastify.put(BASE_DUTIES_ROUTE, createDuty);

  fastify.post(`${BASE_DUTIES_ROUTE}/:id`, updateDuty);

  fastify.delete(`${BASE_DUTIES_ROUTE}/:id`, deleteDuty);

  done();
}
