import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-modal-loading',
    template: `
    <div>
        <div mat-dialog-header>
            <h1 mat-dialog-title class="text-primary">Descargando</h1>
        </div>
        <div mat-dialog-content>
        <mat-spinner></mat-spinner>
      </div>
    </div>
    `,
    styleUrls: ['./modal-loading-spinner.component.scss']
})

export class ModalLoadingComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ModalLoadingComponent>,
    ) { }

    ngOnInit() { }
}