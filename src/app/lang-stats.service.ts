import { Injectable } from '@angular/core';


export const TOTAL_WORDS_SUPPORTED = {
  'persian': 4397,
  'spanish': 7682,
  'russian': 7254,
  'portuguese': 7451,
  'georgian': 564
}



@Injectable({
  providedIn: 'root'
})
export class LangStatsService {

  constructor() { }
}
