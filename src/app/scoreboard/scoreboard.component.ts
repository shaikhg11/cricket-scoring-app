import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BatterSelectDialogComponent } from '../batter-select-dialog/batter-select-dialog.component';
import { BowlerSelectDialogComponent } from '../bowler-select-dialog/bowler-select-dialog.component';
import { NameCustomizeDialogComponent } from '../name-customize-dialog/name-customize-dialog.component';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit, OnDestroy {
  team = 'Team A';
  runs = 0;
  wickets = 0;
  overs = 0; 
  ballsInCurrentOver = 0;

  striker = { name: 'Batter 1', runs: 0, balls: 0 };
  nonStriker = { name: 'Batter 2', runs: 0, balls: 0 };
  bowler = 'Bowler 1';

  recentBalls: string[] = [];

  availableBowlers = ['Bowler 1', 'Bowler 2', 'Bowler 3', 'Bowler 4', 'Bowler 5', 'Bowler 6', 'Bowler 7', 'Bowler 8', 'Bowler 9', 'Bowler 10', 'Bowler 11'];
  availableBatters = ['Batter 3', 'Batter 4', 'Batter 5', 'Batter 6', 'Batter 7', 'Batter 8', 'Batter 9', 'Batter 10', 'Batter 11'];

  private currentMatchId: number | null = null;
  private saveTimer: any;

  constructor(private dialog: MatDialog, private databaseService: DatabaseService) {}

  async ngOnInit() {
    // Start a new match
    this.currentMatchId = await this.databaseService.saveMatch({
      team: this.team,
      runs: this.runs,
      wickets: this.wickets,
      overs: this.overs
    });

    // Auto-save every 30 seconds
    this.saveTimer = setInterval(() => this.saveCurrentState(), 30000);
  }

  ngOnDestroy() {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }
    this.saveCurrentState();
  }

  async addRuns(runs: number) {
    this.runs += runs;
    this.striker.runs += runs;
    this.striker.balls++;
    this.ballsInCurrentOver++;

    if (runs % 2 !== 0) this.swapStrikers();

    this.addBallSymbol(runs.toString());
    this.checkOverEnd();
    await this.saveBall(runs.toString());
  }

  async addWicket() {
    this.wickets++;
    this.ballsInCurrentOver++;
    this.addBallSymbol('W');
    this.checkOverEnd();
    await this.saveBall('W');

    const dialogRef = this.dialog.open(BatterSelectDialogComponent, {
      width: '300px',
      data: { availableBatters: this.availableBatters }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.selectNewBatter(result);
    });
  }

  async addExtra(type: string) {
    this.runs++;
    this.addBallSymbol(type);
    await this.saveBall(type);
  }

  checkOverEnd() {
    if (this.ballsInCurrentOver === 6) {
      this.overs++;
      this.ballsInCurrentOver = 0;
      this.recentBalls = [];
      this.swapStrikers();
      this.openBowlerDialog();
    }
  }

  openBowlerDialog() {
    // Remove the current bowler from the selection list
    const filteredBowlers = this.availableBowlers.filter(bowler => bowler !== this.bowler);

    const dialogRef = this.dialog.open(BowlerSelectDialogComponent, {
      width: '300px',
      data: { availableBowlers: filteredBowlers, currentBowler: this.bowler }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bowler = result;
      }
    });
  }

  swapStrikers() {
    [this.striker, this.nonStriker] = [this.nonStriker, this.striker];
  }

  addBallSymbol(symbol: string) {
    if (this.recentBalls.length >= 6) this.recentBalls.shift();
    this.recentBalls.push(symbol);
    
  }

  selectNewBatter(batter: string) {
    this.striker = { name: batter, runs: 0, balls: 0 };
    this.availableBatters = this.availableBatters.filter(b => b !== batter);
  }

  customizeName(type: 'striker' | 'nonStriker' | 'bowler') {
    let currentName = '';
    if (type === 'striker') currentName = this.striker.name;
    else if (type === 'nonStriker') currentName = this.nonStriker.name;
    else if (type === 'bowler') currentName = this.bowler;

    // Close previous dialog if open
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(NameCustomizeDialogComponent, {
      width: '300px',
      data: { currentName },
      panelClass: 'centered-dialog'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'striker') this.striker.name = result;
        else if (type === 'nonStriker') this.nonStriker.name = result;
        else if (type === 'bowler') this.bowler = result;
      }
      this.dialogRef = undefined;
    });
  }

  private async saveBall(result: string) {
    if (this.currentMatchId) {
      await this.databaseService.saveBall(this.currentMatchId, this.overs, this.ballsInCurrentOver, result);
    }
  }

  private async saveCurrentState() {
    if (this.currentMatchId) {
      // Update match
      // Note: For simplicity, we're not updating existing records, just saving new balls
      // In a full implementation, you'd update the match record too
    }
  }

  dialogRef?: any; // Add this property to your class
}
