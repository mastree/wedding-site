import { LogLevel } from '../app/log-level.enum';

export type Environment = {
  API_URL: string;
  LOG_LEVEL: LogLevel;
};
