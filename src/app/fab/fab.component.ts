import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent implements OnInit {
  rippleColor = 'rgba(255,166,0,.5)';
  radius = 35;

  constructor() { }

  ngOnInit() {
  }

}
