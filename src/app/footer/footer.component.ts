import { Component, OnInit } from '@angular/core';
import { OrientationService, VERTICAL_LIMIT_PX } from '../orientation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  verticalDisplay: Boolean = window.innerWidth <= VERTICAL_LIMIT_PX;
  constructor(private orientationService: OrientationService) { }

  ngOnInit(): void {

    this.orientationService.isVertical.subscribe(isVertical => this.verticalDisplay = isVertical)
  }

}
