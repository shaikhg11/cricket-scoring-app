import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-batter-select-dialog',
  templateUrl: './batter-select-dialog.component.html',
  styleUrls: ['./batter-select-dialog.component.css']
})
export class BatterSelectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BatterSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { availableBatters: string[] }
  ) {}

  selectBatter(batter: string) {
    this.dialogRef.close(batter);
  }

  cancel() {
    this.dialogRef.close();
  }
}
