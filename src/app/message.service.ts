import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';
import { BehaviorSubject, Subject, Subscription, combineLatest, last, tap } from 'rxjs';

type GetRangeData = {
  data: Message[];
  offset: number;
  totalSize: number;
};

type HttpGetRange = {
  data?: GetRangeData;
  error?: boolean;
  message?: string;
};

export type Message = {
  id: number;
  name: string;
  message: string;
  created_at: number;
};

export type SourceCache = {
  messages: Message[];
  offset: number;
  radius: number; // maximum number of messages before and after page
  dataSize?: number;
  pagination?: Pagination;
};

export type Pagination = {
  page: number;
  pageSize: number;
};

export type PageData = {
  messages: Message[];
  pagination: Pagination;
  dataSize: number;
  status?: undefined | 'loading' | 'success' | 'error';
};

const getSuperRange = (a: number[], b: number[]) => {
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
};
const getSubRange = (a: number[], b: number[]) => {
  return [Math.max(a[0], b[0]), Math.min(a[1], b[1])];
};
const isInsideRange = (a: number[], b: number[]) => {
  const subRange = getSubRange(a, b);
  return subRange[0] == a[0] && subRange[1] == a[1];
};
const getPageRange = (pagination: Pagination) => {
  const start = pagination.page * pagination.pageSize;
  const end = start + pagination.pageSize - 1;
  return [start, end];
};
const getOffsetRange = (offset: number, size: number) => {
  return [offset, offset + size - 1];
};
const getSourceRange = (source: SourceCache) => {
  return getOffsetRange(source.offset, source.messages.length);
};
const getMessagePageFromSource = (pagination: Pagination, source: SourceCache) => {
  console.log(
    `getMessagePageFromSource(pagination=${JSON.stringify(pagination)}, sourceCache=${JSON.stringify(source)})`,
  );
  const pageRange = getPageRange(pagination);
  const sourceRange = getSourceRange(source);
  const subRange = getSubRange(pageRange, sourceRange);
  if (subRange[1] < subRange[0]) {
    return [];
  }
  const takeOffset = Math.max(0, pageRange[0] - sourceRange[0]);
  const takeEnd = pageRange[1] - sourceRange[0];
  return source.messages.slice(takeOffset, takeEnd + 1);
};

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private kRadius = 100;

  baseUrl = environment.API_URL;

  http = inject(HttpClient);
  logger = inject(LoggerService);

  private renewRequest = new Subject<undefined>();
  sourceCache = new BehaviorSubject<SourceCache | undefined>(undefined);
  pageRequest = new BehaviorSubject<Pagination | undefined>(undefined);
  pageData = new BehaviorSubject<PageData>({
    messages: [],
    pagination: {
      page: 0,
      pageSize: 0,
    },
    dataSize: 0,
  });

  subscription: Subscription[] = [];

  constructor() {
    this.subscription.push(
      this.pageRequest.subscribe((pageRequest) => {
        if (!pageRequest) return;
        const currentSource = this.sourceCache.value;
        let currentRange = [0, -1];
        if (currentSource) {
          currentRange = getSourceRange(currentSource);
        }
        let pageRange = getPageRange(pageRequest);
        if (currentSource?.dataSize) {
          pageRange[1] = Math.min(pageRange[1], currentSource.dataSize - 1);
        }
        this.logger.info(
          `[Update Page] currentRange = ${JSON.stringify(currentRange)}, pageRange = ${JSON.stringify(pageRange)}`,
        );
        if (isInsideRange(pageRange, currentRange)) return;
        const range = [Math.max(0, pageRange[0] - this.kRadius), pageRange[1] + this.kRadius];
        this.updateSource(range[0], range[1] - range[0] + 1, pageRequest);
      }),
    );
    this.subscription.push(
      this.renewRequest.subscribe((_) => {
        const currentSource = this.sourceCache.value;
        let currentRange = [0, -1];
        if (currentSource) {
          currentRange = getSourceRange(currentSource);
        }
        this.updateSource(currentRange[0], Math.max(currentRange[1] - currentRange[0] + 1, this.kRadius), this.pageRequest.value);
      }),
    );
    this.subscription.push(
      combineLatest([this.pageRequest, this.sourceCache]).subscribe(([pageRequest, source]) => {
        if (!pageRequest || !source) return;
        this.logger.debug(`combine(pageRequest=${JSON.stringify(pageRequest)}, sourceCache=${JSON.stringify(source)})`);
        this.pageData.next({
          ...this.pageData.value,
          messages: getMessagePageFromSource(pageRequest, source),
          pagination: pageRequest,
          dataSize: source.dataSize || 0,
        });
      }),
    );
  }

  private getMessageInRange(offset: number, rangeSize: number) {
    const salt = new Date().getTime();
    this.logger.info(`getMessageInRange(${offset}, ${rangeSize})`);
    return this.http.get(`${this.baseUrl}/wedding/message/range?offset=${offset}&rangeSize=${rangeSize}&${salt}`);
  }

  private updateSource(offset: number, rangeSize: number, pagination?: Pagination) {
    this.logger.info(`updateSource(${offset}, ${rangeSize}, ${JSON.stringify(pagination)})`);
    this.pageData.next({
      ...this.pageData.value,
      status: 'loading',
    });
    this.getMessageInRange(offset, rangeSize).subscribe({
      next: (res) => {
        (() => {
          const data = (res as HttpGetRange).data as GetRangeData;
          this.logger.debug(`message http get (${offset}, ${rangeSize}) = ${JSON.stringify(res)}`);
          this.logger.debug(`pagination = ${JSON.stringify(pagination)}`);
          if (!this.sourceCache.value) {
            this.sourceCache.next({
              messages: data.data,
              offset: data.offset,
              radius: this.kRadius,
              dataSize: data.totalSize,
              pagination: pagination,
            });
            return;
          }
          const currentSource = this.sourceCache.value;
          // Calculate how many new message since the last data source
          const calculateRangeShift = () => {
            return +data.totalSize - +(currentSource.dataSize || data.totalSize);
          };
          const dataShift = calculateRangeShift();
          const dataRange = [data.offset, +data.offset + +data.data.length - 1];
          const sourceRange = [
            currentSource.offset + dataShift,
            currentSource.offset + dataShift + currentSource.messages.length - 1,
          ];
          this.logger.debug(
            `currentSource = ${JSON.stringify(currentSource)}, dataShift = ${dataShift}, dataRange = ${dataRange}, sourceRange = ${sourceRange}`,
          );
          if (dataRange[1] + 1 < sourceRange[0] || sourceRange[1] + 1 < dataRange[0]) {
            this.sourceCache.next({
              messages: data.data,
              offset: data.offset,
              radius: this.kRadius,
              dataSize: data.totalSize,
            });
            return;
          }
          // merge data
          const mergeArray = (a: Message[], b: Message[]) => {
            this.logger.debug(`a = ${JSON.stringify(a)}, b = ${JSON.stringify(b)}`);
            let ret: Message[] = [];
            let i = 0;
            let j = 0;
            while (i < a.length || j < b.length) {
              while (i < a.length && j < b.length && a[i].id == b[j].id) j++;
              if (j >= b.length || (i < a.length && a[i].id >= b[j].id)) {
                ret.push(a[i]);
                i++;
              } else {
                ret.push(b[j]);
                j++;
              }
            }
            return ret;
          };
          let newData = mergeArray(data.data, currentSource.messages);
          let newRange = [Math.min(dataRange[0], sourceRange[0]), Math.max(dataRange[1], sourceRange[1])];
          if (pagination) {
            const pageRange = getPageRange(pagination);
            const cacheableRange = [pageRange[0] - this.kRadius, pageRange[1] + this.kRadius];
            const start = Math.max(cacheableRange[0] - newRange[0], 0);
            const end = newData.length - Math.max(newRange[1] - cacheableRange[1], 0);
            this.logger.debug(
              `[save cache only] pageRange = ${pageRange}, cacheableRange = ${cacheableRange}, start = ${start}, end = ${end}`,
            );
            newData = newData.slice(start, end);
            newRange = getSubRange(cacheableRange, newRange);
          }
          this.sourceCache.next({
            messages: newData,
            offset: newRange[0],
            radius: this.kRadius,
            dataSize: data.totalSize,
          });
        })();
        this.pageData.next({
          ...this.pageData.value,
          status: 'success',
        });
      },
      error: (err) => {
        this.logger.error(`error on MessageService.updateSource(${offset}, ${rangeSize})`);
        if (!this.sourceCache.value) {
          this.sourceCache.next({
            messages: [],
            offset: 0,
            radius: 0,
          });
        }
        this.pageData.next({
          ...this.pageData.value,
          status: 'error',
        });
      },
    });
  }

  setPage(page: number, pageSize: number) {
    this.logger.info(`setPage(${page}, ${pageSize})`);
    this.pageRequest.next({
      page: page,
      pageSize: pageSize,
    });
  }

  sendMessage(name: string, message: string) {
    this.logger.info(`sendMessage(${name}, ${message})`);
    return this.http
      .post(
        `${this.baseUrl}/wedding/message`,
        {
          name,
          message,
        },
        {
          observe: 'body',
        },
      )
      .pipe(
        tap(() => {
          this.renewRequest.next(undefined);
        }),
      );
  }

  reload() {
    this.logger.info(`reload message page...`);
    this.renewRequest.next(undefined);
  }
}
