import { Injectable } from '@angular/core';
import { interval, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypewriterService {
  constructor() {}

  getTypedText(text: string, millisPerLetter: number = 50) {
    return interval(millisPerLetter).pipe(
      map((x) => text.substring(0, x)),
      take(text.length + 1),
    );
  }
}
