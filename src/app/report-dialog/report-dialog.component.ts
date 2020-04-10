import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IssueType } from '../issue.service';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ReportDialogComponent>) { }

  ngOnInit(): void {
  }


  incorrectTranslation() {
    this.dialogRef.close(IssueType.TRANSLATION)
  }

  wordPlacement() {
    this.dialogRef.close(IssueType.WORDPLACEMENT)
  }
  
  offensive() {
    this.dialogRef.close(IssueType.OFFENSIVE)
  }

}
