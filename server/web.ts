import { resolve } from 'path';
import helmet from '@fastify/helmet';
import staticMw from '@fastify/static';
import status from 'http-status';

// odd thing here is to import fastify instance (server) from logger
// because we use the logger from fastify and need it
// before actually starting the server
import logger, {server} from './utils/logger';
import {db} from './services';
import {apiRoutes} from './routes';
import { errorHandler } from './utils/errorHandling';

// This is where UI will be served
const PREFIX = '/app';

server.register(
  helmet,
  // disables the `contentSecurityPolicy` middleware but keeps the rest.
  // this is required to be able to run our react application scripts
  { contentSecurityPolicy: false }
);

// serve static files where
// webpack bundles the React application
server.register(staticMw, {
    root: resolve(__dirname, '../dist/public'),
    prefix: PREFIX,
    wildcard: false,
  }
);

// redirect to UI
server.get('/', async (_request, reply) => {
  reply.redirect(status.FOUND, PREFIX);
});

server.get(`/favicon.ico`, (_request, reply) => {
  reply.sendFile('favicon.ico');
});

// render index in case we add routing
// to the React app
// future improvement is to do server side rendering
server.get(`${PREFIX}*`, (_request, reply) => {
  reply.sendFile('index.html');
});

// API routes
server.register(apiRoutes);

// error handler
server.setErrorHandler(errorHandler);

// run the web server and make sure the database is connected
export default function run(port: number): Promise<void> {
  process.once('SIGINT', async (): Promise<void> => {
    console.log('SIGINT received, shutting down...');
    try {
      await server.close();
      await db.disconnect();
      logger.info('DB disconnected');
    } catch (e) {
      logger.error('Failed to disconnect from the database. ' + e.stack || e.message);
    }
  });

  return new Promise( (resolve: () => void, reject: (e: Error) => void): void => {
    server.listen({ port }, async (err: Error | null, address: string): Promise<void> => {
      if (err) {
        logger.error(err.message);
        reject(err);
      }
      try {
        logger.info(`Server listening at ${address}`);
        const dbUp = await db.isConnectionWorking();
        if (!dbUp) {
          reject(new Error('Database connection is not working'));
          return;
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
}
