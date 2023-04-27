import path from 'path';
import dotenv from 'dotenv';


// run dotenv config ASAP
dotenv.config({ path: path.join(__dirname, './.env') });

export const HTTP_PORT: number = parseInt(process.env.HTTP_PORT || '3000', 10);
export const DB_HOST: string = process.env.DB_HOST || '127.0.0.1';
export const DB_PORT: number = parseInt(process.env.DB_PORT || '5432', 10);
export const DB_USERNAME: string = process.env.DB_USERNAME || 'user';
export const DB_PASSWORD: string = process.env.DB_PASSWORD || '';
