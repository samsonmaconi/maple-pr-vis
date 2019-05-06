import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
import { MatBottomSheet } from '@angular/material';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.scss']
})
export class ControlpanelComponent implements OnInit {
  constructor(
    private data: DataService,
    private welcomeBottomSheet: MatBottomSheet
  ) {
    this.welcomeBottomSheet.open(WelcomeComponent);
  }

  ngOnInit() {}

  togglePeriod(i) {
    if (this.data.selectedPeriods[i] === '') {
      this.data.selectedPeriods[i] = this.data.periods[i];
    } else {
      this.data.selectedPeriods[i] = '';
    }
    this.data.periodsChanged.emit();
  }

  toggleProvince(i) {
    if (this.data.selectedProvinces[i] === '') {
      this.data.selectedProvinces[i] = this.data.provinces[i];
      d3.select(`.province${i + 1}`).classed('clicked', true);
    } else {
      this.data.selectedProvinces[i] = '';
      d3.select(`.province${i + 1}`).classed('clicked', false);
    }

    d3.select(`.province${i + 1}`).on('click')(
      d3.select(`.province${i + 1}`).data()[0]
    );
  }
}
