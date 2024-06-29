import { Injectable } from '@angular/core';
import { LogLevel } from './log-level.enum';

type LogLevelColorMap = {
  [key in LogLevel]: string;
};

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor() {}

  debug(...msg: string[]) {
    this.print(LogLevel.DEBUG, ...msg);
  }
  info(...msg: string[]) {
    this.print(LogLevel.INFO, ...msg);
  }
  warn(...msg: string[]) {
    this.print(LogLevel.WARN, ...msg);
  }
  error(...msg: string[]) {
    this.print(LogLevel.ERROR, ...msg);
  }
  fatal(...msg: string[]) {
    this.print(LogLevel.FATAL, ...msg);
  }

  private print(level: LogLevel, ...msg: string[]) {
    console.log(`${new Date().toISOString()} - [${LogLevel[level][0]}]: ${msg.join(' ')}`);
  }
}
