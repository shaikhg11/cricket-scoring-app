import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bowler-select-dialog',
  templateUrl: './bowler-select-dialog.component.html',
  styleUrls: ['./bowler-select-dialog.component.css']
})
export class BowlerSelectDialogComponent {
  filteredBowlers: string[];

  constructor(
    public dialogRef: MatDialogRef<BowlerSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { availableBowlers: string[], currentBowler: string }
  ) {
    // Remove current bowler from the list
    this.filteredBowlers = data.availableBowlers.filter(
      bowler => bowler !== data.currentBowler
    );
  }

  selectBowler(bowler: string) {
    this.dialogRef.close(bowler);
  }

  cancel() {
    this.dialogRef.close();
  }
}
