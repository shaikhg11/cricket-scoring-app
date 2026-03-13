import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  template: '<div style="padding:16px;"><app-scoreboard></app-scoreboard></div>'
})
export class AppComponent implements OnInit {
  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    await this.databaseService.initializeDatabase();
  }
}
