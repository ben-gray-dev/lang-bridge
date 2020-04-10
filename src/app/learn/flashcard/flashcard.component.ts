import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Word, ApiService } from 'src/app/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from 'src/app/report-dialog/report-dialog.component';
import { IssueType } from 'src/app/issue.service';
import {MatSnackBar} from '@angular/material/snack-bar';
export interface DialogData {
  animal: string;
  name: string;
}



@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit {

  @ViewChild('answer', {static: false}) answer: ElementRef;

  wordGuess: String = ''
  correctedWord: String
  keyboardShow: Boolean = true
  isMuted: Boolean = false
  @Input() width: String = '40vw';
  @Input() height: String = '20vh';
  @Input() viewingWord: Word;
  @Input() rtl: Boolean;  
  @Input() keyboardLocale: String;
  @Output() guess: EventEmitter<String> = new EventEmitter<String>();
  @Output() nextWordNeeded: EventEmitter<any> = new EventEmitter<any>();
  @Output() prevWordNeeded: EventEmitter<any> = new EventEmitter<any>();
  @Output() readSentenceAloud: EventEmitter<any> = new EventEmitter<any>();


  ngOnChanges(e) {
    if (e.hasOwnProperty('viewingWord')) {
      this.wordGuess = '';
    }
    setTimeout(() => {
      if (this.answer) {
        this.answer.nativeElement.focus();
      }
    })
   
  }
  @Input() answerSize: number;

 




  constructor(private dialog: MatDialog,
    private apiService: ApiService,
    private reportSnackNotification: MatSnackBar) { }

  ngOnInit(): void {
    window.onkeypress = _ => {
      this.answer.nativeElement.focus();
    }
  }

  wordIsGuessed() {
    this.guess.emit(this.wordGuess);
  }


  updateLastFreq() {

  }

  nextWord() {
    this.nextWordNeeded.emit(true);
    this.answer.nativeElement.focus();
  } 

  previousWord() {
    this.prevWordNeeded.emit(true);
  }

  readSentence() {
    this.readSentenceAloud.emit(true);
  }


  reportProblem() {
    const dialogRef = this.dialog.open(ReportDialogComponent)
    dialogRef.afterClosed().subscribe((result: IssueType) => {
      if (result) {
        this.apiService.reportIssue(this.viewingWord, result).subscribe(res => {
          this.reportSnackNotification.open('Content reported successfully!', '', {
            duration: 2000,
          });
        }, err => {
          this.reportSnackNotification.open('Error reporting content. Please try again.', '', {
            duration: 2000,
          });
        })
      }
    });
  }


  toggleKeyboard() {
    if (this.keyboardShow) {
      // do nothing
    } else {
      this.answer.nativeElement.focus();
    }
    this.keyboardShow = !this.keyboardShow
  }

  mute() {
    this.isMuted = !this.isMuted
  }
}
