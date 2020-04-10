import { Component, OnInit, Output, EventEmitter, Input, Inject, LOCALE_ID } from '@angular/core';
import { Language, ApiService } from 'src/app/api.service';
import { Locale, LOCALE_VALUE_MAPPING } from 'src/app/localization.service';

@Component({
  selector: 'app-lang-select',
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.scss']
})
export class LangSelectComponent implements OnInit {

  @Output() langSelected: EventEmitter<Language> = new EventEmitter();
  @Input() langsAlreadySelected: Language[]

  showLang: {}
  currentLocale: Locale;
  localValueMap = LOCALE_VALUE_MAPPING;

  isSpanishLocalized: Boolean;
  isEnglishLocalized: Boolean;

  constructor(private apiService: ApiService, @Inject(LOCALE_ID) public locale: string) {
    this.assignLocale(locale)
   }

  ngOnInit(): void {
    this.showLang = {
      'spanish': true,
      'persian': true,
      'russian': true,
      'portuguese': true,
      'georgian': true,
      'french': true,
      'englishSpanish': true
    }
    if (this.langsAlreadySelected) {
      this.langsAlreadySelected.map(lang => {
        this.showLang[lang] = false;
      });
    }
    
    this.isSpanishLocalized = this.currentLocale === this.localValueMap['spanish']
    this.isEnglishLocalized = this.currentLocale === this.localValueMap['english']
  }

  assignLocale(locale: String) {
    if (locale.startsWith('es')) {
      this.currentLocale = Locale.es
    } else {
      this.currentLocale = Locale.en
    }
  }




  selectLanguage(lang: Language) {
    this.apiService.selectNewLanguage(lang).subscribe(res => {
      this.langSelected.emit(res.languages[res.languages.length - 1].name);
    },
    err => {
      console.log(err)
    })
  }


  selectSpanish() {
    this.selectLanguage(Language.spanish);
  }
  selectFrench() {
    this.selectLanguage(Language.french);
  }
  selectRussian() {
    this.selectLanguage(Language.russian);
  }
  selectPortuguese() {
    this.selectLanguage(Language.portuguese);
  }
  selectGeorgian() {
    this.selectLanguage(Language.georgian);
  }

  selectPersian() {
    this.selectLanguage(Language.persian);
  }

  selectEnglishSpanish() {
    this.selectLanguage(Language.englishSpanish);
  }


}
