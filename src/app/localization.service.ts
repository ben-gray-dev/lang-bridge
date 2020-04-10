import { Injectable } from '@angular/core';

export enum Locale {
  en,
  es
}

export const LOCALE_VALUE_MAPPING = {
  'english': 0,
  'spanish': 1
}

export const LOCALE_NUM_LANGS = [
  6, // english
  1, // spanish
]

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor() { }
}
