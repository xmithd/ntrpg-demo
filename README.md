# NTRPG-demo

![Application Sample](https://i.imgur.com/WIpXt3b.png)
This is a demo application to keep track of a list of duties. The tech stack is Node, Typescript, React and PostgreSQL. This application could be used as the basis to build more complex applications.

## Development setup

### Prerequisites

  * NodeJS should be installed in your computer. The current LTS version is v18.
Run the npm commands from the root of the project folder.

  * A running Postgres database. Run the db/init.sql script to create the table and insert some data.
 For convenience, a docker-compose.yml is provided to launch a database locally with docker.

### Environment variables

`dotenv` is included for convenience so you can set variables in the `server/.env` file.

| VAR           | DESC                                       | DEFAULT               |
| ------------- | ------------------------------------------ | ----------------------|
| HTTP_PORT     | The port in which this application runs    | 3000                  |
| DB_HOST       | The host of the PostgreSQL database        | 127.0.0.1             |
| DB_PORT       | The port of the PostgreSQL database        | 5432                  |
| DB_USERNAME   | The database user to use                   | user                  |
| DB_PASSWORD   | The password of the database user          |                       |

### Commands

First, run `npm install` to get all the dependencies.

To run in development mode, you can run `npm run watch` in one terminal to transpile changes when a file changes. Then on another terminal, you can run `npm run dev` to actually start the application which will restart when changes are made.

#### Tests

This project uses jest to run tests. Launch tests with `npm run test` or `npm test`. To run tests in watch mode, use `npm test -- --watch`.

#### Build

For production, run the `npm run build` command. Before building, it is advisable to run `npm run type-check` to make sure all type errors are caught by the TypeScript compiler.
For convenience, a Dockerfile is provided to containerize this application running on the node:lts-slim base image. To build the docker image, use the command `docker image build -t ntrpg-demo:1.0.0 .` replacing the image name and tag as you wish.

#### Run production code

After building, execute `npm run serve` to run the application. 

## Future improvements

Some potential improvements are:

  * Unit test coverage
  * The UI is very basic. The code can be improved
  * Responsive and accessible UI
  * Error boundary is missing in the React app
  * A Not Found page could be added
  * Support for batch changes and pagination
  * Server side rendering
  * Database settings for production


## License

[MIT licensed](./LICENSE)
