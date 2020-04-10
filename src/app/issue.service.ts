import { Injectable } from '@angular/core';


export enum IssueType {
  TRANSLATION = "Incorrect translation",
  WORDPLACEMENT = "Wrong word replaced in sentence",
  OFFENSIVE = "Offensive/Inappropriate content"
}


@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor() { }
}
