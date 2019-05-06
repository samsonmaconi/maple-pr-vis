import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatRippleModule } from '@angular/material';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FabComponent } from './fab/fab.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CanadamapComponent } from './canadamap/canadamap.component';
import { BarchartComponent } from './barchart/barchart.component';
import { ControlpanelComponent } from './controlpanel/controlpanel.component';
import { GenderratioComponent } from './genderratio/genderratio.component';
import { DonutchartComponent } from './donutchart/donutchart.component';
import { RadarchartComponent } from './radarchart/radarchart.component';
import { StackedHorizBarChartComponent } from './stacked-horiz-bar-chart/stacked-horiz-bar-chart.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    FabComponent,
    SpinnerComponent,
    CanadamapComponent,
    ControlpanelComponent,
    BarchartComponent,
    GenderratioComponent,
    DonutchartComponent,
    RadarchartComponent,
    StackedHorizBarChartComponent,
    WelcomeComponent
  ],
  entryComponents: [WelcomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRippleModule,
    MatCardModule,
    MatChipsModule,
    MatBottomSheetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
