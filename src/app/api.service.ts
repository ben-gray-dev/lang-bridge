import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IssueType } from './issue.service';

export interface SignUpEntry {
  name: string;
  email: string;
  password: string;
}

export interface LoginEntry {
  email: string;
  password: string;
}

export interface ProfileInfo {
  name: string;
  email: string;
  bio: string;
  lastLogIn?: number;
  languages?: Language[];
}


export interface Sentence {
  sentence: string;
  leadingLemma: string;
  trailingLemma: string;
  translation: string;
}


export interface Example {
  sentence: string;
  leadingLemma: string;
  trailingLemma: string;
  translation: string;
  index: number;
}


export interface ExampleInfo {
  target: string;
  exampleIdx: number[];
}

export interface Definition {
  pos: string;
  meanings: string[];
  examples?: ExampleInfo[]
}

// export interface Word {
//   lemma: string;
//   freq: number;
//   rawFreq: number;
//   definitions: string[];
//   pos: string[];
//   pronunciations?: string[];
//   exampleSentence: Sentence;
//   termPositionInSentence?: number;
//   guessedCorrectly?: Boolean;
// }

export interface Word {
  _id: string;
  lemma: string;
  freq: number;
  rawFreq: number;
  definition: Definition;
  exampleInfo: ExampleInfo;
  exampleSentence: Example;
  numExamples: number;
  guessedCorrectly?: Boolean;
  wasGuessed?: Boolean;
}

export interface SelectLang {
  language: Language;
}



export enum Language {
  persian = 'persian',
  spanish = 'spanish',
  french = 'french',
  russian = 'russian',
  georgian = 'georgian',
  portuguese = 'portuguese',
  englishSpanish = 'englishSpanish'
}


export const langDisplayName = {
  'persian': 'persian',
  'spanish': 'spanish',
 'french': 'french',
  'russian': 'russian',
 'georgian': 'georgian',
 'portuguese': 'portuguese',
 'englishSpanish': 'inglés'
}

export const langToPath = {
  'persian': '/persian',
  'spanish': '/spanish'
};

export const API_BASE_URL = 'https://api.lang-bridge.com';
export const API_PATHS = {
  'signup': '/users',
  'login': '/users/login',
  'updatePassword': '/updatePassword',
  'forgotPassword': '/forgotPassword',
  'profileInfo': '/users/me',
  'language': '/language',
  'selectLanguage': '/language/selectLanguage',
  'dailyWords': '/language/dailyWords',
  'languages': '/language/languages',
  'lastFreq': '/language/lastFreq',
  'incorrectAnswer': '/language/incorrectAnswer',
  'correctAnswer': '/language/correctAnswer',
  'langStats': '/language/stats',
  'sendToken': '/verifyToken',
  'reportContent': '/report'
}

export const ACCOUNT_CREATION_SUCCESS_MSG = 'Account created successfully.';
export const LOGIN_SUCCESS_MSG = 'Login successful';
export const LOGIN_FAILURE_MSG = 'Incorrect Email/Password Combination.';
export const PROFILE_UPDATE_SUCCESS_MSG = 'Profile updated successfully.';
export const PROFILE_UPDATE_FAILURE_MSG = 'Error updating profile.';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient, public router: Router) { }


  signUp(data: SignUpEntry): Observable<any> {
    return this.httpClient.post(API_BASE_URL + API_PATHS.signup, data, {})
      .pipe(
        catchError(this.handleError)
      )
  }


  login(data: LoginEntry): Observable<any> {
    return this.httpClient.post(API_BASE_URL + API_PATHS.login, data, {})
      .pipe(
        catchError(this.handleError)
      )
  }

  getAuthHeader() {
    const myToken = localStorage.getItem('token');
    if (!myToken) {
      this.router.navigate(['login'])
    }
    const req_headers = {
      'Authorization': myToken
    };
    return req_headers
  }

  getCurrentSystemTime() {
    return Math.floor(Date.now() / 1000);
  }

  getProfileInfo(): Observable<any> {
    const req_headers = { 'Authorization': localStorage.getItem('token') };
    return this.httpClient.get(API_BASE_URL + API_PATHS.profileInfo, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  saveProfileInfo(data: ProfileInfo): Observable<any> {
    const req_headers = { 'Authorization': localStorage.getItem('token') };
    return this.httpClient.put(API_BASE_URL + API_PATHS.profileInfo, data, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  getWordsFromIDList(data: String[], lang: Language): Observable<any> {
    const req_headers = { 'Authorization': localStorage.getItem('token') };
    return this.httpClient.post(`${API_BASE_URL}${API_PATHS.language}${langToPath[lang]}`, data, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  selectNewLanguage(lang: Language): Observable<any> {
    const req_headers = { 'Authorization': localStorage.getItem('token') };
    return this.httpClient.post(`${API_BASE_URL}${API_PATHS.selectLanguage}`, { 'language': lang }, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  getLanguages(): Observable<any> {
    const req_headers = { 'Authorization': localStorage.getItem('token') };
    return this.httpClient.get(`${API_BASE_URL}${API_PATHS.languages}`, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  getDailyWords(lang?: Language): Observable<any> {
    const req_headers = { 'Authorization': localStorage.getItem('token') };
    if (lang) {
      return this.httpClient.post(`${API_BASE_URL}${API_PATHS.dailyWords}`, { 'language': lang }, { headers: req_headers })
        .pipe(
          catchError(this.handleError)
        )
    }
    return this.httpClient.post(`${API_BASE_URL}${API_PATHS.dailyWords}`, {}, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  submitAnswer(lang: Language, freq: number, rawFreq: number, lemma: String, isCorrect: Boolean): Observable<any> {
    const submitTime = this.getCurrentSystemTime();
    const req_headers = this.getAuthHeader();
    const body = {
      'language': lang,
      'freq': freq,
      'timeStamp': submitTime,
      'rawFreq': rawFreq,
      'lemma': lemma
    }
    return this.httpClient.put(`${API_BASE_URL}${isCorrect ? API_PATHS.correctAnswer : API_PATHS.incorrectAnswer}`, body, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }


  updateLastFreq(lang: Language, lastFreq: number): Observable<any> {
    const submitTime = Math.floor(Date.now() / 1000);
    const req_headers = { 'Authorization': localStorage.getItem('token') };
    if (!req_headers.Authorization) {
      this.router.navigate(['login'])
    }
    const body = {
      'language': lang,
      'lastFreq': lastFreq,
      'time': submitTime
    }
    return this.httpClient.put(`${API_BASE_URL}${API_PATHS.lastFreq}`, body, { headers: req_headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  sendToken(token) {
    const body = {
      'recaptcha': token
    }
    return this.httpClient.post(`${API_BASE_URL}${API_PATHS.sendToken}`, body)
  }

  resetPassword(password: String, token: String): Observable<any> {
    const body = {
      'password': password,
      'token': token
    }
    return this.httpClient.put(`${API_BASE_URL}${API_PATHS.profileInfo}${API_PATHS.updatePassword}`, body)
      .pipe(
        catchError(this.handleError)
      )

  }


  sendForgotPasswordEmail(email: String): Observable<any> {
    const body = {
      'email': email
    }
    return this.httpClient.post(`${API_BASE_URL}${API_PATHS.forgotPassword}`, body)
      .pipe(
        catchError(this.handleError)
      )
  }

  reportIssue(word: Word, issueType: IssueType): Observable<any> {
    const headers = this.getAuthHeader()
    const body = {
      'issueDescription': issueType,
      'sentence': word.exampleSentence.sentence,
      'translation': word.exampleSentence.translation,
      'lemma': word.lemma,
      'wordId': word._id
    }
    return this.httpClient.post(`${API_BASE_URL}${API_PATHS.reportContent}`, body, {headers: headers})
      .pipe(
        catchError(this.handleError)
      )
  }

  languageStats(lang: Language): Observable<any> {
    const headers = this.getAuthHeader()
    const body = {
      'language': lang
    }
    return this.httpClient.post(`${API_BASE_URL}${API_PATHS.langStats}`, body, {headers: headers})
      .pipe(
        catchError(this.handleError)
      )
  }



  private handleError(error: HttpErrorResponse) {
    if (!error) {
      this.router.navigate(['login'])
    }
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      return throwError('Uh-oh, network error on your end. Please try again.')
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

      if (error.status == 403) {
        this.router.navigate(['login'])
      } else if (error.status == 400 || error.status == 401) {
        return throwError(error.error.error);
      } else {
        return throwError('Service currently unavailable. Please try again later.')
      }
    }
  };



}
