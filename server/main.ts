import {HTTP_PORT} from './config';
import run from './web';

// entry point for the application

function main(): void {
  run(HTTP_PORT).catch( e => {
    console.error(e);
    process.exit(1);
  })
}

main();
