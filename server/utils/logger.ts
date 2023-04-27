import Fastify from 'fastify';

// use the default fastify logger
export const server = Fastify({
  logger: true
});

// just use the fastify logger
const fl = server.log;
/**
 * Wrapper class
 * for logging. Only exposes info and error methods
 */
class Logger {
  info<T>(msg: string, ...args: T[]): void {
    fl.info(msg, ...args);
  }

  error<T>(msg: string, ...args: T[]): void {
    fl.error(msg, ...args);
  }
}
const logger = new Logger();
export default logger;
