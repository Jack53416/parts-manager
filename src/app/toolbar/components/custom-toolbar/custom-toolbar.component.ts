import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-toolbar',
  templateUrl: './custom-toolbar.component.html',
  styleUrls: ['./custom-toolbar.component.scss'],
})
export class CustomToolbarComponent implements OnInit {
  @Input() showBox: boolean;
  dupa2Visible = false;
  constructor() {}

  showDupa2() {
    this.dupa2Visible = true;
  }
  ngOnInit(): void {}
}
