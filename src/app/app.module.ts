import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { BatterSelectDialogComponent } from './batter-select-dialog/batter-select-dialog.component';
import { BowlerSelectDialogComponent } from './bowler-select-dialog/bowler-select-dialog.component';
import { NameCustomizeDialogComponent } from './name-customize-dialog/name-customize-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ScoreboardComponent,
    BatterSelectDialogComponent,
    BowlerSelectDialogComponent,
    NameCustomizeDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
