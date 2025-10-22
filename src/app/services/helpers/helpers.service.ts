import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  constructor() {}

  public isArrayOfStrings(arr: any) {
    return Array.isArray(arr) && arr.length > 0 && arr.every((item) => typeof item === 'string');
  }

  public isArrayOfIntegers(arr: any) {
    return Array.isArray(arr) && arr.length > 0 && arr.every((item) => Number.isInteger(item));
  }
}
