import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-name-customize-dialog',
  templateUrl: './name-customize-dialog.component.html',
  styleUrls: ['./name-customize-dialog.component.css']
})
export class NameCustomizeDialogComponent {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<NameCustomizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentName: string }
  ) {
    this.name = data.currentName;
  }

  save() {
    this.dialogRef.close(this.name);
  }

  cancel() {
    this.dialogRef.close();
  }
}
