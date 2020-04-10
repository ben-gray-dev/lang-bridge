import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgAnimateScrollService } from 'ng-animate-scroll';
import { OrientationService, VERTICAL_LIMIT_PX } from '../orientation.service';
import { LOCALE_ID, Inject } from '@angular/core';
import { Locale, LOCALE_VALUE_MAPPING } from '../localization.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  verticalDisplay: Boolean = window.innerWidth <= VERTICAL_LIMIT_PX;
  imageUrlArray: String[] = [];
  
  // en languages
  
  persianSelected = false;
  spanishSelected = false;
  frenchSelected = false;
  georgianSelected = false;
  russianSelected = false;
  portugueseSelected = false;

  // es languages

  spanishToEnglishSelected = false;



  optimizedToolTipText: String;
  langsToolTipText: String;
  currentLocale: Locale;
  localValueMap = LOCALE_VALUE_MAPPING;

  isSpanishLocalized: Boolean;
  isEnglishLocalized: Boolean;

  @ViewChild('slideshow') slideshow: any;
  
  constructor(public router: Router, private animateScrollService: NgAnimateScrollService, private orientationService: OrientationService, @Inject(LOCALE_ID) public locale: string) {
    this.assignLocale(locale)
    this.assignImageArray(this.currentLocale)
    this.isEnglishLocalized = this.currentLocale === this.localValueMap['english']
    this.isSpanishLocalized = this.currentLocale === this.localValueMap['spanish']
  }

  
  ngOnInit(): void {
    const localizedOptimizedToolTip = $localize`:@@OPTIMIZED_TOOL_TIP:`
    const localizedLangToolTip = $localize`:@@LANG_TOOL_TIP:`
    this.optimizedToolTipText = localizedOptimizedToolTip ? localizedOptimizedToolTip: "Check out our algorithm!";
    this.langsToolTipText = localizedLangToolTip ? localizedLangToolTip : "See our supported languages";
    this.orientationService.isVertical.subscribe(isVertical => this.verticalDisplay = isVertical)
  }


  assignLocale(locale: String) {
    if (locale.startsWith('es')) {
      this.currentLocale = Locale.es
    } else {
      this.currentLocale = Locale.en
    }
  }

  assignImageArray(locale: Locale) {
    switch(locale) {
      case Locale.es:
        this.imageUrlArray = ['./../../assets/englishLang.jpeg']
        this.spanishToEnglishSelected = true
        break
      case Locale.en:
        this.imageUrlArray = ['./../../assets/spanishLang.jpeg', './../../assets/portugueseLang.jpeg','./../../assets/persianLang.jpeg', './../../assets/frenchLang.jpeg', './../../assets/georgianLang2.jpeg', './../../assets/russianLang.jpeg']
        break
    }
  }

  startLearning() { 
    this.router.navigate(['register'])
  }

  showAlgorithm() {
    this.animateScrollService.scrollToElement('algorithmWrapper');
  }

  showLangs() {
    this.animateScrollService.scrollToElement('langScrollTarget');
  }



  // es language switchings

  switchToSpanishEnglish() {
    this.slideshow.goToSlide(0);
  }


  
  // en language switching

  switchToSpanish() {
    this.slideshow.goToSlide(0);
  }
  switchToPortuguese() {
    this.slideshow.goToSlide(1);
  }

  switchToPersian() {
    this.slideshow.goToSlide(2);
  }
  switchToFrench() {
    this.slideshow.goToSlide(3);
  }
  switchToGeorgian() {
    this.slideshow.goToSlide(4);
  }
  switchToRussian() {
    this.slideshow.goToSlide(5);
  }

  slideShowIndexChanged(idx) {
    this.resetAllLangSelections();
    switch(idx) {
      case 0:
        this.spanishSelected = true;
        break
      case 1:
        this.portugueseSelected = true;
        break
      case 2:
        this.persianSelected = true;
        break
      case 3:
        this.frenchSelected = true;
        break
      case 4:
        this.georgianSelected = true;
        break
      case 5:
        this.russianSelected = true;
        break
    }
  }

  resetAllLangSelections() {
    this.persianSelected = false;
    this.spanishSelected = false;
    this.portugueseSelected = false;
    this.georgianSelected = false;
    this.russianSelected = false;
    this.frenchSelected = false;
    this.spanishToEnglishSelected = false;
  }

}
