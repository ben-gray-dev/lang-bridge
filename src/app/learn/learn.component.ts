import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApiService, Language, Word } from '../api.service';
import { Locale, LOCALE_VALUE_MAPPING, LOCALE_NUM_LANGS } from '../localization.service';
import { FlashcardComponent } from './flashcard/flashcard.component';
@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {

  @ViewChild(FlashcardComponent) flashcard: FlashcardComponent;
  NUM_LANGUAGES_OFFERED = 6;
  FONT_STYLE = ''
  language: Language;
  languageSubject = new BehaviorSubject<Language>(null);
  languagesLearning: Language[];
  showLanguageSelection: Boolean = false;
  minViableWindowWidth = 665;
  flashCardVWDefault = 40;
  flashCardDefault = 600;
  arrowVWDefault = 10;
  arrowDefault = 300;
  arrowWidth: String = `max('${this.arrowDefault}vw', ${this.arrowDefault}px)`
  flashCardWidth: String = `max(${this.flashCardVWDefault}vw, ${this.flashCardDefault}px)`;
  flashCardHeight: String = '40vh';
  sampleIDList = ['5e9b2b613c4af7587ff28c90', '5e9b2b613c4af7587ff28c91', '5e9b2b613c4af7587ff28c9a']
  currentWordList: Word[];
  currentWordListCursor: number = 0;
  furthestWordListCursor: number = 0;
  initialLastFreq: number;
  currentWordRenderedSize: number;
  persianSelected = false;
  spanishSelected = false;
  portugueseSelected = false;
  georgianSelected = false;
  russianSelected = false;
  frenchSelected = false;
  englishSpanishSelected = false;

  currentUtterance: SpeechSynthesisUtterance;
  currentlyReading: Boolean = false;
  speechSynthInstance: SpeechSynthesis = window.speechSynthesis; 


  isCorrectAnswer = false;
  isNewlyPaged = false;
  firstIncorrectAnswerSeen = false;
  currentlyPagingData = false;
  persianStr = Language.persian;
  frenchStr = Language.french;
  spanishStr = Language.spanish;
  russianStr = Language.russian;
  georgianStr = Language.georgian;
  portugueseStr = Language.portuguese;
  englishSpanishStr = Language.englishSpanish;


  speechSynthesisLangCodes = {
    'persian': 'ar-SA',
    'spanish': 'es-MX',
    'russian': 'ru-RU',
    'portuguese': 'pt-BR',
    'french': 'fr-FR',
    'englishSpanish': 'en-US'
  }

  keyboardIDMap = {
    'persian': 'fa',
    'spanish': 'es',
    'russian': 'ru',
    'portuguese': 'pt',
    'french': 'fr',
    'georgian': 'ka',
    'englishSpanish': 'en'
  }

  currentLocale: Locale;
  localValueMap = LOCALE_VALUE_MAPPING;
  isSpanishLocalized: Boolean;
  isEnglishLocalized: Boolean;


  constructor(private apiService: ApiService, private router: Router, private zone: NgZone, @Inject(LOCALE_ID) public locale: string) { 
    this.assignLocale(locale)
    this.NUM_LANGUAGES_OFFERED = LOCALE_NUM_LANGS[this.currentLocale]
    this.isEnglishLocalized = this.currentLocale === this.localValueMap['english']
    this.isSpanishLocalized = this.currentLocale === this.localValueMap['spanish']
  }
  

  ngOnInit(): void {
    this.languageSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(l => l !== null)
      ).subscribe(lang => {
      this.currentWordList = undefined;
      this.fetchDailyWords(lang)
    })
    this.resizeFlashCardSystem(window.innerWidth);
    
    window.onresize = e => {
      this.resizeFlashCardSystem(e.target.innerWidth);
    }
    this.apiService.getLanguages().subscribe(res => {
      this.languagesLearning = res.map(r => {return r.name});
      this.language = res[0]['name'];
      this.initialLastFreq = res[0]['lastFreq'];
      this.selectLanguage(this.language);
    }, err => {
      console.log(err)
      if (err === 'no languages') {
        this.showLanguageSelection = true;
      } 

     
    })
    
  }

  assignLocale(locale: String) {
    if (locale.startsWith('es')) {
      this.currentLocale = Locale.es
    } else {
      this.currentLocale = Locale.en
    }
  }

  isLangRTL(lang: Language): Boolean {
    switch (lang) {
      case Language.persian:
        return true;
      case Language.russian:
      case Language.spanish:
      case Language.georgian:
      case Language.portuguese:
      case Language.englishSpanish:
      case Language.french:
        return false;
    }
  }

  getLangKeyboardLocale(lang: Language): String {
    return this.keyboardIDMap[lang]
  }



  getLanguageFromString(langStr: String): Language {
    switch(langStr) {
      case 'persian':
        return Language.persian
      case 'french':
        return Language.french
      case 'spanish':
        return Language.spanish
      case 'portuguese':
        return Language.portuguese
      case 'russian':
        return Language.russian
      case 'georgian':
        return Language.georgian
      case 'englishSpanish':
        return Language.englishSpanish
      default:
        return undefined
    }
  }


  fetchDailyWords(lang?: Language) {
    this.apiService.getDailyWords(lang).subscribe(res => {
      this.currentWordList = this.parseWordResponse(res);
      this.currentWordRenderedSize = this.getTextWidth(this.currentWordList[0].lemma, '3vh', 'Strait');
    },
    (err: HttpErrorResponse) => {
      if (err.status === 495) {
        this.showLanguageSelection = true;
      }
      if (err.status === 403) {
        this.router.navigate(['login'])
      }
      console.log(err);
    });
  }

  getNextPage() {
    this.apiService.getDailyWords(this.language).subscribe(res => {
      this.currentWordList = this.currentWordList.concat(this.parseWordResponse(res));
      this.currentWordRenderedSize = this.getTextWidth(this.currentWordList[0].lemma, '3vh', 'Strait');
      this.currentlyPagingData = false;
      this.isNewlyPaged = true;
      this.nextWord()
    },
    (err: HttpErrorResponse) => {
      this.currentlyPagingData = false;
      if (err.status === 495) {
        this.showLanguageSelection = true;
      }
      if (err.status === 403) {
        this.router.navigate(['login'])
      }
    });
    
  }

  selectLanguage(lang: Language) {
    switch(lang) {
      case Language.persian:
        this.switchToPersian()
        break
      case Language.russian:
        this.switchToRussian();
        break
      case Language.portuguese:
        this.switchToPortuguese();
        break
      case Language.georgian:
        this.switchToGeorgian();
        break
      case Language.french:
        this.switchToFrench();
        break
      case Language.spanish:
        this.switchToSpanish();
        break
      case Language.englishSpanish:
        this.switchToEnglishSpanish();
        break
    }
  }



  parseWordResponse(res): Word[] {
    return res.map(entry => {
        const pickedSentence = entry.example[Math.floor(Math.random() * entry.example.length)];
        const relevantDefinition = entry.definitions.find(d =>  d.examples.find(ex => ex.exampleIdx && ex.exampleIdx.includes(pickedSentence.index)))
        const relevantExampleInfo = relevantDefinition.examples.find(ex => ex.exampleIdx.includes(pickedSentence.index));

        const wordEntry: Word =  {
          _id: entry._id,
          lemma: entry.lemma,
          freq: entry.freq,
          rawFreq: entry.rawFreq,
          definition: relevantDefinition,
          exampleSentence: pickedSentence,
          exampleInfo: relevantExampleInfo,
          numExamples: entry.numExamples,
          guessedCorrectly: false,
          wasGuessed: false
        }
        this.extractKeywordFromSentence(wordEntry);
        return wordEntry;
      })
  }

  regexIndexOf(str, regex, startpos) {
    var indexOf = str.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
  }


  extractKeywordFromSentence(word: Word) {
    const exampleSentence = word.exampleSentence;
    var regex = new RegExp("([.,\/#!$%\^&\*;:{}=\-_`'\"~() ])(" + word.lemma + ")([.,\/#!$%\^&\*;:{}=\-_`'\"~() ])", "g");
    const indexOfKeyword = this.regexIndexOf(`${exampleSentence.sentence} `, regex, 0)
    //const indexOfKeyword = exampleSentence.sentence.indexOf(` ${word.lemma} `);
    exampleSentence.leadingLemma = exampleSentence.sentence.substring(0, indexOfKeyword).trim();
    exampleSentence.trailingLemma = `${exampleSentence.sentence.substring(indexOfKeyword + word.lemma.length + 1).trim()}`;
  
    
  }


  loadNewWords() {
    
  }

  addNewLang() {
    this.language = undefined;
    this.showLanguageSelection = true;
  }

  private resizeFlashCardSystem(newWidth) {
    if (newWidth < this.minViableWindowWidth) {
      this.flashCardWidth = `${newWidth - 150}px`;
      this.arrowWidth = `${newWidth - 200}px`;
    } else {
      this.arrowWidth = `max('${this.arrowDefault}vw', ${this.arrowDefault}px)`
      this.flashCardWidth = `max(${this.flashCardVWDefault}vw, ${this.flashCardDefault}px)`;
    }
  }

  nextWord() {
    if (this.currentlyReading) {
      this.speechSynthInstance.cancel()
      this.currentlyReading = false
    } else {
      if (!this.isCorrectAnswer && this.currentWordListCursor === this.furthestWordListCursor && !this.isNewlyPaged) {
        this.onGuess(this.flashcard.wordGuess);
      } else {
        if (this.isNewlyPaged) {
          this.isNewlyPaged = false;
        }
        if (this.currentWordListCursor < this.currentWordList.length - 1 && this.currentWordListCursor >= 0) {
          if (!this.currentWordList[this.currentWordListCursor].guessedCorrectly) {
            console.log('suggestion')
          }
          this.currentWordRenderedSize = this.getTextWidth(this.currentWordList[this.currentWordListCursor + 1].lemma, '3vh', 'Strait');
          this.currentWordListCursor++;
          if (this.currentWordListCursor > this.furthestWordListCursor) {
            this.furthestWordListCursor = this.currentWordListCursor
          }
        } else if (this.currentWordListCursor === this.currentWordList.length - 1){
          if (!this.currentlyPagingData) {
            this.currentlyPagingData = true;
            this.getNextPage();
          }
          
        }
        this.resetWordGuessStatus();
      }
    }


  }

  onSelection(event: Language) {
    this.language = event;
    this.languageSubject.next(this.language);
    this.selectNewLanguage(this.language);
    this.apiService.getLanguages().subscribe(res => {
      this.languagesLearning = res.map(r => {return r.name});
      this.initialLastFreq = res.find(r => r.name === event).lastFreq;
    }, err => {
      console.log(err)
      if (err === 'Auth') {
        this.router.navigate(['login'])
      }
    })
  }

  onGuess(event: String) {
    const viewingWord = this.currentWordList[this.currentWordListCursor];
    
    if (event.localeCompare(viewingWord.lemma) != 0) {
      this.isCorrectAnswer = false;
      viewingWord.wasGuessed = true;
      this.flashcard.wordGuess = '';
      this.flashcard.correctedWord = viewingWord.lemma;
      if (!this.firstIncorrectAnswerSeen) {
        var word = this.currentWordList[this.currentWordListCursor];
        this.apiService.submitAnswer(this.language, word.freq, word.rawFreq, word.lemma, false).subscribe();
        this.firstIncorrectAnswerSeen = true;
      }
      
    } else {
      this.isCorrectAnswer = true;
      this.currentWordList[this.currentWordListCursor].guessedCorrectly = true;
      // this.apiService.updateLastFreq(this.language, this.currentWordListCursor   + this.initialLastFreq).subscribe(res => {
      if (!this.firstIncorrectAnswerSeen) {
        var word = this.currentWordList[this.currentWordListCursor];
        this.apiService.submitAnswer(this.language, word.freq, word.rawFreq, word.lemma, this.isCorrectAnswer).subscribe(res => {
          if (!this.flashcard.isMuted) {
            this.readSentence().onend = () => this.zone.run(() => {
              this.endVoiceOnCorrect()
            });
          } else {
            this.delayForMutedReview()
          }
        }, err => {
          console.log(err);
          if (err === 'Auth') {
            this.router.navigate(['login'])
          }
        }) 
      } else {
        if (!this.flashcard.isMuted) {
          this.readSentence().onend = () => this.zone.run(() => {
            this.endVoiceOnCorrect()
          });
        } else {
          this.delayForMutedReview()
        }
      }
    }
  }

  delayForMutedReview() {
    timer(1000).subscribe(_ => this.endVoiceOnCorrect())
  }

  endVoiceOnCorrect() {
    this.currentlyReading = false;
    this.nextWord();
  }

  selectNewLanguage(lang: Language) {
    this.resetAllLangSelections();
    switch(lang) {
      case Language.persian:
        this.persianSelected = true;
        break
      case Language.russian:
        this.russianSelected = true;
        break
      case Language.portuguese:
        this.portugueseSelected = true;
        break
      case Language.georgian:
        this.georgianSelected = true;
        break
      case Language.french:
        this.frenchSelected = true;
        break
      case Language.spanish:
        this.spanishSelected = true;
        break
      case Language.englishSpanish:
        this.englishSpanishSelected = true;
        break
    }
  }

  previousWord() {
    if (this.currentWordListCursor <= this.currentWordList.length - 1 && this.currentWordListCursor > 0) {
      this.currentWordRenderedSize = this.getTextWidth(this.currentWordList[this.currentWordListCursor - 1].lemma, '3vh', 'Strait');
      this.currentWordListCursor--;
    }

  }

  previousReadManager() {
    const ut = this.readSentence()
    if (ut) {
      ut.onend = () => this.zone.run(() => {
        this.currentlyReading = false;
      });
    }
  }

  readSentence() {
    if (!this.currentlyReading) {
      this.currentlyReading = true;
      const sentence = this.currentWordList[this.currentWordListCursor].exampleSentence.sentence;
      this.currentUtterance = new SpeechSynthesisUtterance(sentence);
      this.currentUtterance.lang = this.speechSynthesisLangCodes[this.language];
      this.speechSynthInstance.speak(this.currentUtterance);
      return this.currentUtterance;
    } else {
      return undefined
    }
  }


  // English supported languages

  switchToPersian() {
    this.resetAllLangSelections();
    this.persianSelected = true;
    this.language = Language.persian;
    this.languageSubject.next(this.language)
  }

  switchToSpanish() {
    this.resetAllLangSelections();
    this.spanishSelected = true;
    this.language = Language.spanish;
    this.languageSubject.next(this.language)
  }
  
  switchToPortuguese() {
    this.resetAllLangSelections();
    this.portugueseSelected = true;
    this.language = Language.portuguese;
    this.languageSubject.next(this.language)
  }
  switchToGeorgian() {
    this.resetAllLangSelections();
    this.georgianSelected = true;
    this.language = Language.georgian;
    this.languageSubject.next(this.language)
  }
  switchToRussian() {
    this.resetAllLangSelections();
    this.russianSelected = true;
    this.language = Language.russian;
    this.languageSubject.next(this.language)
  }
  switchToFrench() {
    this.resetAllLangSelections();
    this.frenchSelected = true;
    this.language = Language.french;
    this.languageSubject.next(this.language)
  }


  // Spanish supported languages


  switchToEnglishSpanish() {
    this.resetAllLangSelections();
    this.englishSpanishSelected = true;
    this.language = Language.englishSpanish;
    this.languageSubject.next(this.language)
  }

  resetAllLangSelections() {
    this.currentWordListCursor = 0;
    this.persianSelected = false;
    this.spanishSelected = false;
    this.portugueseSelected = false;
    this.georgianSelected = false;
    this.russianSelected = false;
    this.frenchSelected = false;
    this.englishSpanishSelected = false;
  }

  resetWordGuessStatus() {
    this.firstIncorrectAnswerSeen = false;
    this.isCorrectAnswer = false;
  }

  private getTextWidth(text, size, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = `${size} ${font}`;
    var metrics = context.measureText(text);
    return metrics.width;
};



}
