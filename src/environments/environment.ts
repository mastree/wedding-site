import { LogLevel } from '../app/log-level.enum';
import { Environment } from './types';

export const environment: Environment = {
  // TODO: provide prod url before deployment
  API_URL: 'http://localhost/api',
  LOG_LEVEL: LogLevel.INFO,
};
