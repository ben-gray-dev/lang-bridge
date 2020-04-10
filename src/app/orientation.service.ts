import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export const VERTICAL_LIMIT_PX = 1400;

@Injectable({
  providedIn: 'root'
})
export class OrientationService {
  
  isVertical = new BehaviorSubject<Boolean>(window.innerWidth <= VERTICAL_LIMIT_PX);
  constructor() { 
    window.onresize = _ => {
      if (window.innerWidth <= VERTICAL_LIMIT_PX) {
        this.isVertical.next(true);
      } else {
        this.isVertical.next(false);
      }
    }
  }
}
