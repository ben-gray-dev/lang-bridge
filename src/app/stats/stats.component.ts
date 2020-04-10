import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Language, ApiService, langDisplayName } from '../api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import 'echarts';
import { Locale, LOCALE_VALUE_MAPPING, LocalizationService } from '../localization.service';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  language: Language;
  loadingStats: Boolean = false;
  languageSubject = new BehaviorSubject<Language>(null);
  persianSelected = false;
  spanishSelected = false;
  portugueseSelected = false;
  georgianSelected = false;
  russianSelected = false;
  frenchSelected = false;
  englishSpanishSelected = false;

  persianStr = Language.persian;
  frenchStr = Language.french;
  spanishStr = Language.spanish;
  russianStr = Language.russian;
  georgianStr = Language.georgian;
  portugueseStr = Language.portuguese;
  englishSpanishStr = Language.englishSpanish;
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  histogramFrequencies: any;

  languagesLearning: Language[];
  showNoDataMessage: boolean;
  seenFreqList = []
  langFreqData = []
  currentWordMap: any;
  wordMaps = {}
  runningStatsQuery: Subscription = undefined;

  frequencyRankString: String;
  termString: String;
  cumPercentileString: String;

  // learning levels
  learnIString: String
  learnIIString: String
  learnIIIString: String
  learnIVString: String
  learnVString: String
  learnedString: String
  unseenString: String
  
  wordFrequencyRankingString: String
  estimatedComprehensionOfString: String



  currentLocale: Locale;
  localValueMap = LOCALE_VALUE_MAPPING;
  isSpanishLocalized: Boolean;
  isEnglishLocalized: Boolean;
  constructor(private apiService: ApiService, @Inject(LOCALE_ID) public locale: string, private localizationService: LocalizationService) {


    this.assignLocale(locale)
    this.isEnglishLocalized = this.currentLocale === this.localValueMap['english']
    this.isSpanishLocalized = this.currentLocale === this.localValueMap['spanish']
    console.log(this.isEnglishLocalized)

  }

  ngOnInit(): void {

    // localize strings
    this.frequencyRankString = $localize`:@@FREQUENCY_RANK:` ? $localize`:@@FREQUENCY_RANK:` : 'frequency rank: '
    this.termString = $localize`:@@TERM:` ? $localize`:@@TERM:` : 'term: '
    this.cumPercentileString = $localize`:@@CUM_PERCENTILE:` ? $localize`:@@CUM_PERCENTILE:` : 'cumulative percentile: '
    this.learnIString = $localize`:@@LEARNING_I:` ? $localize`:@@LEARNING_I:` : 'Learning I (Minutely repetition)'
    this.learnIIString = $localize`:@@LEARNING_II:` ? $localize`:@@LEARNING_II:` : 'Learning II (Hourly repetition)'
    this.learnIIIString = $localize`:@@LEARNING_III:` ? $localize`:@@LEARNING_III:` : 'Learning III (Daily repetition)'
    this.learnIVString = $localize`:@@LEARNING_IV:` ? $localize`:@@LEARNING_IV:` : 'Learning IV (Weekly repetition)'
    this.learnVString = $localize`:@@LEARNING_V:` ? $localize`:@@LEARNING_V:` : 'Learning V (Monthly repetition'
    this.learnedString = $localize`:@@LEARNED:` ? $localize`:@@LEARNED:` : 'Learned'
    this.unseenString = $localize`:@@UNSEEN:` ? $localize`:@@UNSEEN:` : 'Unseen'
    this.wordFrequencyRankingString = $localize`:@@WORD_FREQ_RANKING:` ? $localize`:@@WORD_FREQ_RANKING:` : 'Word frequency ranking'
    this.estimatedComprehensionOfString = $localize`:@@ESTIMATED_COMPREHENSION_OF:` ? $localize`:@@ESTIMATED_COMPREHENSION_OF:` : 'Estimated percent comprehension of'

    console.log(this.unseenString)

    this.languageSubject.pipe(
      distinctUntilChanged(),
      filter(l => l !== null)
    ).subscribe((lang: Language) => {
      this.switchLangMap(lang)
      this.loadingStats = true;
      if (this.runningStatsQuery) {
        this.runningStatsQuery.unsubscribe()
        this.runningStatsQuery = undefined
      }
      this.runningStatsQuery = this.apiService.languageStats(lang).subscribe(res => {
        this.langFreqData = res.sort((a, b) => a.cumPercentile - b.cumPercentile)
        this.generateHistogram(lang)
        this.loadingStats = false;
      }, err => {

      });

    })

    this.apiService.getLanguages().subscribe(res => {
      this.languagesLearning = res.map(r => { return r.name });
      this.language = res[0]['name'];
      this.currentWordMap = res[0]['wordMap']
      res.map(r => this.wordMaps[r.name] = r.wordMap)
      this.selectLanguage(this.language);
    }, err => {
      console.log(err)
      if (err === 'no languages') {
        this.showNoDataMessage = true;
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




  switchLangMap(lang: Language) {
    this.seenFreqList = []
    switch (lang) {
      case Language.persian:
        this.currentWordMap = this.wordMaps['persian']
        break
      case Language.russian:
        this.currentWordMap = this.wordMaps['russian']
        break
      case Language.portuguese:
        this.currentWordMap = this.wordMaps['portuguese']
        break
      case Language.georgian:
        this.currentWordMap = this.wordMaps['georgian']
        break
      case Language.french:
        this.currentWordMap = this.wordMaps['french']
        break
      case Language.spanish:
        this.currentWordMap = this.wordMaps['spanish']
        break
      case Language.englishSpanish:
        this.currentWordMap = this.wordMaps['englishSpanish']
        break
    }
  }


  selectLanguage(lang: Language) {
    switch (lang) {
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


  generateHistogram(lang: Language) {
    const rawFreqList = this.langFreqData.map(f => f.rawFreq);
    const sumRawFreq = rawFreqList.reduce((a, b) => a + b);
    const maxScaledRawFreq = Math.max(...rawFreqList) / sumRawFreq
    var cumulativeFreq = 0;
    this.histogramFrequencies = {
      tooltip: {
        trigger: 'axis',
        formatter: parser => {
          const wordEl = this.langFreqData.find(f => f.freq === parser[0].value[0])
          if (wordEl) {
            return `${this.termString}${wordEl.lemma}<br>${this.frequencyRankString}${wordEl.freq}<br>${this.cumPercentileString}${wordEl.cumPercentile.toFixed(2)}%`
          } else {
            return `${this.frequencyRankString}${parser[0].value[0]}<br>`
          }
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          },
          crossStyle: {
            color: 'white'
          }
        }
      },
      plotOptions: {
        bar: {
          pointPadding: 0,
          groupPadding: 0
        }
      },
      grid: {
        top: '7%',
        right: '5%',
        bottom: '25%'
      },
      legend: {
        data: [this.learnIString, this.learnIIString, this.learnIIIString, this.learnIVString, this.learnVString, this.learnedString, this.unseenString],
        textStyle: {
          color: 'white'
        }
      },
      xAxis: [
        {
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          },

          type: 'value',
          name: this.wordFrequencyRankingString,
          nameLocation: 'middle',
          nameGap: 40,
          min: 0,
          max: Math.max(...this.langFreqData.map(f => f.freq)),
          //max: 50,
          interval: 500,

        }
      ],
      yAxis: [
        {
          axisLine: {
            lineStyle: {
              color: 'white',
              opacity: 1
            }
          },
          type: 'value',
          name: `${this.estimatedComprehensionOfString} ${langDisplayName[lang]}`,
          nameLocation: 'middle',
          nameGap: 40,
          min: 0,
          max: 100,
          interval: 10,
          lineStyle: { color: '#d5ceeb' }
        }
      ],
      dataZoom: [
        {
          show: true,
          xAxisIndex: [0],
          type: 'slider',
          top: '90%',
          start: 0,
          end: 1500
        }
      ],
      series: [
        {
          name: this.learnIString,
          type: 'bar',
          barGap: '-100%',
          data: this.currentWordMap[0].freqs.map(f => {
            this.seenFreqList.push(f.value)
            return [f.value, this.langFreqData.find(lf => lf.freq === f.value).cumPercentile]
          }),
          itemStyle: {
            color: '#EB684C'
          }
        },
        {
          name: this.learnIIString,
          type: 'bar',
          barGap: '-100%',
          data: this.currentWordMap[1].freqs.map(f => {
            this.seenFreqList.push(f.value)
            return [f.value, this.langFreqData.find(lf => lf.freq === f.value).cumPercentile]
          }),
          itemStyle: {
            color: '#EA8F54'
          }
          
        },
        {
          name: this.learnIIIString,
          type: 'bar',
          barGap: '-100%',
          data: this.currentWordMap[2].freqs.map(f => {
            this.seenFreqList.push(f.value)
            return [f.value, this.langFreqData.find(lf => lf.freq === f.value).cumPercentile]
          }),
          itemStyle: {
            color: '#F2BB60'
          }
        },
        {
          name: this.learnIVString,
          type: 'bar',
          barGap: '-100%',
          data: this.currentWordMap[3].freqs.map(f => {
            this.seenFreqList.push(f.value)
            return [f.value, this.langFreqData.find(lf => lf.freq === f.value).cumPercentile]
          }),
          itemStyle: {
            color: '#EEF260'
          }
        },
        {
          name: this.learnVString,
          type: 'bar',
          barGap: '-100%',
          data: this.currentWordMap[4].freqs.map(f => {
            this.seenFreqList.push(f.value)
            return [f.value, this.langFreqData.find(lf => lf.freq === f.value).cumPercentile]
          }),
          itemStyle: {
            color: '#BBF260'
            
          }
        },
        {
          name: this.learnedString,
          type: 'bar',
          barGap: '-100%',
          data: this.currentWordMap[5].freqs.map(f => {
            this.seenFreqList.push(f.value)
            return [f.value, this.langFreqData.find(lf => lf.freq === f.value).cumPercentile]
          }),
          itemStyle: {
            color: '#93BB55'
            
          }
        },
        {
          name: this.unseenString,
          type: 'bar',
          barGap: '-100%',
          data: this.langFreqData.filter(lf => !this.seenFreqList.includes(lf.freq)).map(f => [f.freq, f.cumPercentile]),
          itemStyle: {
            color: 'gray'
          }
        }
      ]
    };
  }


  resetAllLangSelections() {
    this.persianSelected = false;
    this.spanishSelected = false;
    this.portugueseSelected = false;
    this.georgianSelected = false;
    this.russianSelected = false;
    this.frenchSelected = false;
    this.englishSpanishSelected = false;
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


  
}
